// this only tests adding/modifying permisions through the /permissions route
// requests that require permissions (e.g., creation, deletion) are tested elsewhere
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const {StreamUser} = require('../models');
const {connectToDB, sequelize} = require('../util/db');
const {addUser, addStream, clearDB, createPermissions, logInUser} = require('./util/functions');
const {badToken, expiredUserTwoToken, invalidId, stream, user} = require('./util/constants');

// variables for user + stream objects
let userTwo;
let userFive;
let streamZero;

beforeAll(async () => {
  // runs migrations and makes sure that all the relations are there
  await connectToDB();
});

beforeEach(async () => {
  await clearDB();

  // create and log in users
  await addUser(user.two);
  await addUser(user.five);
  userTwo = await logInUser(user.two);
  userFive = await logInUser(user.five);

  // create new stream
  streamZero = await addStream(user.two, stream.zero);
});

describe('valid requests (user has admin permissions)', () => {
  test('add with default permissions', async () => {
    // request to add permissions
    const {body} = await api
      .put(`/api/permissions/${streamZero.id}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .send({userId: userFive.id})
      .expect(200);

    // returns correct user and stream IDs
    expect(body.userId).toBe(userFive.id);
    expect(body.streamId).toBe(streamZero.id);

    // also check entry added to DB
    const permissionsDB = await StreamUser.findOne({where: {userId: userFive.id}});
    expect(permissionsDB).not.toBe(null);
    expect(permissionsDB.streamId).toBe(streamZero.id);

    // correct (i.e. default) permissions returned + in DB
    [body, permissionsDB].forEach((obj) => {
      expect(obj.read).toBe(true);
      expect(obj.write).toBe(false);
      expect(obj.deleteOwn).toBe(false);
      expect(obj.deleteAll).toBe(false);
      expect(obj.admin).toBe(false);
    });
  });

  test('add with non-default permissions', async () => {
    const {body} = await api
      .put(`/api/permissions/${streamZero.id}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .send({
        userId: userFive.id,
        write: true,
        deleteOwn: true,
        deleteAll: false
      })
      .expect(200);

    // returns corrrect user and stream IDs
    expect(body.userId).toBe(userFive.id);
    expect(body.streamId).toBe(streamZero.id);

    // check entry added to DB
    const permissionsDB = await StreamUser.findOne({where: {userId: userFive.id}});
    expect(permissionsDB).not.toBe(null);
    expect(permissionsDB.streamId).toBe(streamZero.id);

    // correct permissions in body + DB
    [body, permissionsDB].forEach((obj) => {
      expect(obj.read).toBe(true); // default
      expect(obj.write).toBe(true); // specified
      expect(obj.deleteOwn).toBe(true); // specified
      expect(obj.deleteAll).toBe(false); // default + specified
      expect(obj.admin).toBe(false); // default
    });

  });

  test('modify existing permissions', async () => {
    // add default permissions
    await api
      .put(`/api/permissions/${streamZero.id}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .send({userId: userFive.id})
      .expect(200);

    // now request to modify them
    const {body} = await api
      .put(`/api/permissions/${streamZero.id}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .send({
        userId: userFive.id,
        read: false,
        write: true,
        deleteOwn: true,
        admin: false
      })
      .expect(200);

    // returns corrrect user and stream IDs
    expect(body.userId).toBe(userFive.id);
    expect(body.streamId).toBe(streamZero.id);

    // check entries in DB
    const rowsDB = await StreamUser.findAll({where: {userId: userFive.id}});
    expect(rowsDB).toHaveLength(1); // only one entry --> didn't create a new one
    const permissionsDB = rowsDB[0];
    expect(permissionsDB.streamId).toBe(streamZero.id);

    // correct permissions in body + DB
    [body, permissionsDB].forEach((obj) => {
      expect(obj.read).toBe(false); // modified
      expect(obj.write).toBe(true); // modified
      expect(obj.deleteOwn).toBe(true); // modified
      expect(obj.deleteAll).toBe(false); // default
      expect(obj.admin).toBe(false); // default + specified
    });
  });
});

describe('invalid requests', () => {
  test('missing userId', async () => {
    const {body} = await api
      .put(`/api/permissions/${streamZero.id}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .expect(400);

    expect(body.error).toBe('userId missing');
  });

  test('missing streamId', async () => {
    await api
      .put('/api/permissions')
      .set('Authorization', `Bearer ${userTwo.token}`)
      .send({userId: userFive.id})
      .expect(404);
  });

  test('invalid userId', async () => {
    const {body} = await api
      .put(`/api/permissions/${streamZero.id}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .send({userId: invalidId})
      .expect(404);

    expect(body.error).toBe('invalid userId');
  });

  test('invalid streamId', async () => {
    const {body} = await api
      .put(`/api/permissions/${invalidId}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .send({userId: userFive.id})
      .expect(404);

    expect(body.error).toBe('stream not found');
  });

  test('non-boolean permission value', async () => {
    const {body} = await api
      .put(`/api/permissions/${streamZero.id}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .send({
        userId: userFive.id,
        write: 'david'
      })
      .expect(400);

    expect(body.error).toContain('invalid input syntax for type boolean');
  });

  test('missing token', async () => {
    const {body} = await api
      .put(`/api/permissions/${streamZero.id}`)
      .send({userId: userFive.id})
      .expect(401);

    expect(body.error).toBe('token missing');
  });

  test('bad token', async () => {
    const {body} = await api
      .put(`/api/permissions/${streamZero.id}`)
      .set('Authorization', `Bearer ${badToken}`)
      .send({userId: userFive.id})
      .expect(400);

    expect(body.error).toBe('jwt malformed');
  });

  test('expired token', async () => {
    const {body} = await api
      .put(`/api/permissions/${streamZero.id}`)
      .set('Authorization', `Bearer ${expiredUserTwoToken}`)
      .send({userId: userFive.id})
      .expect(403);

    expect(body.error).toBe('login token has expired');
  });

  test('non-admin create (no permissions in DB)', async () => {
    // user.five is trying to create new permissions for themselves here
    const {body} = await api
      .put(`/api/permissions/${streamZero.id}`)
      .set('Authorization', `Bearer ${userFive.token}`)
      .send({userId: userFive.id})
      .expect(403);

    expect(body.error).toBe('no user permissions for this stream');
  });

  test('non-admin create (permissions in DB)', async () => {
    // create default permissions for third user (user.six)
    await addUser(user.six);
    const userSix = await logInUser(user.six);
    await createPermissions(userSix, streamZero);

    // now request for user.six to create permissions on the stream for user.five
    const {body} = await api
      .put(`/api/permissions/${streamZero.id}`)
      .set('Authorization', `Bearer ${userSix.token}`)
      .send({userId: userFive.id})
      .expect(403);

    expect(body.error).toBe('admin permissions required');
  });

  test('non-admin modify (no permissions in DB)', async () => {
    // user.five (no permissions in DB) is trying to modify permissions for user.two (the creator)
    const {body} = await api
      .put(`/api/permissions/${streamZero.id}`)
      .set('Authorization', `Bearer ${userFive.token}`)
      .send({
        userId: userTwo.id,
        admin: false
      })
      .expect(403);

    expect(body.error).toBe('no user permissions for this stream');
  });

  test('non-admin modify (permissions in DB)', async () => {
    // assign default permissions to user.five
    await createPermissions(userFive, streamZero);

    // now user.five (in DB with default permissions) trys to modify themselves
    const {body} = await api
      .put(`/api/permissions/${streamZero.id}`)
      .set('Authorization', `Bearer ${userFive.token}`)
      .send({
        userId: userFive.id,
        admin: true
      })
      .expect(403);

    expect(body.error).toBe('admin permissions required');
  });
});

afterAll(async () => {
  await sequelize.close();
});