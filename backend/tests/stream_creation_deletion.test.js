const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const {StreamUser, Stream} = require('../models');
const {connectToDB, sequelize} = require('../util/db');
const {addStream, addUser, clearDB, createPermissions, logInUser} = require('./util/functions');
const {badToken, expiredUserTwoToken, stream, user} = require('./util/constants');

let loginObject;

beforeAll(async () => {
  // runs migrations and makes sure that all the relations are there
  await connectToDB();
});

beforeEach(async () => {
  await clearDB();
  await addUser(user.two);
  loginObject = await logInUser(user.two);
});

describe('valid requests', () => {
  test('stream creation', async () => {
    // send request to create new stream
    const {body} = await api
      .post('/api/streams')
      .set('Authorization', `Bearer ${loginObject.token}`)
      .send(stream.zero)
      .expect(200);

    // everything is returned as expected
    expect(body.name).toBe(stream.zero.name);
    expect(body.creatorId).toBe(loginObject.id);
    expect(body.id).toBeDefined();

    // stream is in the DB as expected
    const newStream = await Stream.findByPk(body.id);
    expect(newStream.name).toBe(stream.zero.name);
    expect(newStream.creatorId).toBe(loginObject.id);

    // user permissions are correctly set in DB
    const permissions = await StreamUser.findOne({where: {streamId: newStream.id}});
    expect(permissions.userId).toBe(loginObject.id);
    expect(permissions.read).toBe(true); // here down are the default permissions for a stream's creator
    expect(permissions.write).toBe(true);
    expect(permissions.deleteOwn).toBe(true);
    expect(permissions.deleteAll).toBe(true);
    expect(permissions.admin).toBe(true);
  });

  test('stream deletion by creator', async () => {
    // add stream to DB
    const {id} = await addStream(user.two, stream.zero);

    // verify that the stream is in the DB
    const thisStream = await Stream.findByPk(id);
    expect(thisStream).toBeDefined();

    // request to delete
    await api
      .delete(`/api/streams/${thisStream.id}`)
      .set('Authorization', `Bearer ${loginObject.token}`)
      .expect(204);

    // verify that stream removed from DB
    const removedStream = await Stream.findByPk(id);
    expect(removedStream).toBe(null);

    // verify permissions for stream also removed from DB
    const permissions = await StreamUser.findOne({where: {streamId: id}});
    expect(permissions).toBe(null);
  });

  test('stream deletion by authorized non-creator', async () => {
    // add stream to DB
    const thisStream = await addStream(user.two, stream.zero);

    // create new user, log in, and assign operative permission
    await addUser(user.five);
    const userFive = await logInUser(user.five);
    await createPermissions(userFive, thisStream, {deleteAll: true});

    // delete request
    await api
      .delete(`/api/streams/${thisStream.id}`)
      .set('Authorization', `Bearer ${userFive.token}`)
      .expect(204);
  });
});

describe('invalid requests', () => {
  describe('cannot create with ...', () => {
    test('token missing', async () => {
      const {body} = await api
        .post('/api/streams')
        .send(stream.zero)
        .expect(401);

      expect(body.error).toBe('token missing');
    });

    test('bad token', async () => {
      const {body} = await api
        .post('/api/streams')
        .set('Authorization', `Bearer ${badToken}`)
        .send(stream.zero)
        .expect(400);

      expect(body.error).toBe('jwt malformed');
    });

    test('expired token', async () => {
      const {body} = await api
        .post('/api/streams')
        .set('Authorization', `Bearer ${expiredUserTwoToken}`)
        .expect(403);

      expect(body.error).toBe('login token has expired');
    });
  });

  describe('cannot delete with ...', () => {
    let thisStream;

    beforeEach(async () => {
      // add the stream we're trying to delete
      thisStream = await addStream(user.two, stream.zero);
    });

    test('token missing', async () => {
      const {body} = await api
        .delete(`/api/streams/${thisStream.id}`)
        .expect(401);

      expect(body.error).toBe('token missing');
    });

    test('bad token', async () => {
      const {body} = await api
        .delete(`/api/streams/${thisStream.id}`)
        .set('Authorization', `Bearer ${badToken}`)
        .expect(400);

      expect(body.error).toBe('jwt malformed');
    });

    test('expired token', async () => {
      const {body} = await api
        .delete(`/api/streams/${thisStream.id}`)
        .set('Authorization', `Bearer ${expiredUserTwoToken}`)
        .expect(403);

      expect(body.error).toBe('login token has expired');
    });

    test('user permissions not in DB', async () => {
      // create and log in user (without creating stream permissions)
      await addUser(user.five);
      const userFive = await logInUser(user.five);

      // delete request
      const {body} = await api
        .delete(`/api/streams/${thisStream.id}`)
        .set('Authorization', `Bearer ${userFive.token}`)
        .expect(403);

      expect(body.error).toBe('no user permissions for this stream');
    });

    test('non-creator user lacking deleteAll permission', async () => {
      // create, login, and assign permissions
      await addUser(user.five);
      const userFive = await logInUser(user.five);
      await createPermissions(
        userFive,
        thisStream,
        {
          read: true,
          write: true,
          deleteOwn: true,
          deleteAll: false,
          admin: true,
        });

      // delete request
      const {body} = await api
        .delete(`/api/streams/${thisStream.id}`)
        .set('Authorization', `Bearer ${userFive.token}`)
        .expect(403);

      expect(body.error).toBe('user cannot delete this stream');
    });

    test('stream already deleted', async () => {
      // delete the first time
      await api
        .delete(`/api/streams/${thisStream.id}`)
        .set('Authorization', `Bearer ${loginObject.token}`)
        .expect(204);

      // can't delete again
      const {body} = await api
        .delete(`/api/streams/${thisStream.id}`)
        .set('Authorization', `Bearer ${loginObject.token}`)
        .expect(404);

      expect(body.error).toBe('stream not found');
    });
  });
});

afterAll(async () => {
  await sequelize.close();
});
