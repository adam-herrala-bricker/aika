// note: these are only tests for the /api/streams/read endpoint
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const {Op} = require('sequelize');
const {connectToDB, sequelize} = require('../util/db');
const {StreamUser} = require('../models');
const {addStream, addUser, clearDB, createPermissions, logInUser} = require('./util/functions');
const {badToken, expiredUserTwoToken, invalidId, stream, user} = require('./util/constants');

// variables for user objects returned on login
let userTwo;
let userFive;

// variable for stream objects returned upon stream creation
let streamZero;
let streamOne;
let streamTwo;

// note: no requests we'll test will alter the DB, so only
// need to add everything once at the beginning
beforeAll(async () => {
  await connectToDB(); // runs migrations and makes sure that all the relations are there
  await clearDB();

  // add users to DB
  await addUser(user.two);
  await addUser(user.five);

  // log users in
  userTwo = await logInUser(user.two);
  userFive = await logInUser(user.five);

  // set up DB entries for user.two
  streamZero = await addStream(user.two, stream.zero);
  streamOne = await addStream(user.two, stream.one);

  // set up DB entry for user.five
  streamTwo = await addStream(user.five, stream.two);

  // set additional user permissions (this requires objects that include IDs)
  await createPermissions(userFive, streamZero, {read: true});
  await createPermissions(userTwo, streamTwo, {read: false, write: true});
});

describe('valid requests', () => {
  test('returns all created streams', async () => {
    const {body} = await api
      .get('/api/streams/read')
      .set('Authorization', `Bearer ${userTwo.token}`)
      .expect(200);

    // contains exactly the two entries we put in
    expect(body).toHaveLength(2);

    // check contents for both entries
    [streamZero, streamOne].forEach((thisStream) => {
      const thisEntry = body.find((entry) => entry.stream.name === thisStream.name);

      // verify creator permissions
      expect(thisEntry.read).toBe(true);
      expect(thisEntry.write).toBe(true);
      expect(thisEntry.deleteOwn).toBe(true);
      expect(thisEntry.deleteAll).toBe(true);
      expect(thisEntry.admin).toBe(true);

      // time stamps are there
      expect(thisEntry).toHaveProperty('createdAt');
      expect(thisEntry).toHaveProperty('updatedAt');

      // stream data included
      expect(thisEntry.stream.name).toBe(thisStream.name);
      expect(thisEntry.stream.creatorId).toBe(userTwo.id);
      expect(thisEntry.stream.id).toBe(thisStream.id);

      // no redundant properties
      expect(thisEntry).not.toHaveProperty('userId');
      expect(thisEntry).not.toHaveProperty('streamId');
    });
  });

  test('returns shared entries with read permissions', async () => {
    const {body} = await api
      .get('/api/streams/read')
      .set('Authorization', `Bearer ${userFive.token}`)
      .expect(200);

    // get the entry we're interested in checking
    const sharedEntry = body.find((entry) => entry.stream.creatorId === userTwo.id);

    // only the assigned read permissions
    expect(sharedEntry.read).toBe(true);
    expect(sharedEntry.write).toBe(false);
    expect(sharedEntry.deleteOwn).toBe(false);
    expect(sharedEntry.deleteAll).toBe(false);
    expect(sharedEntry.admin).toBe(false);

    // correct stream data included
    expect(sharedEntry.stream.id).toBe(streamZero.id);
    expect(sharedEntry.stream.name).toBe(streamZero.name);
    expect(sharedEntry.stream.creatorId).toBe(userTwo.id);
  });

  test('returns single stream with all permissions', async() => {
    const {body} = await api
      .get(`/api/streams/my-permissions/${streamZero.id}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .expect(200);

    // returns everything as expected
    expect(body.streamId).toBe(streamZero.id);
    expect(body.userId).toBe(userTwo.id);
    expect(body.read).toBe(true);
    expect(body.write).toBe(true);
    expect(body.deleteOwn).toBe(true);
    expect(body.deleteAll).toBe(true);
    expect(body.admin).toBe(true);
  });

  test('does not return entries shared with non-read permissions', async () => {
    // first verify that userTwo has WRITE (not read) permissions on streamTwo in DB
    const thesePermissions = await StreamUser.findOne({
      where: {
        [Op.and]: {
          streamId: streamTwo.id,
          userId: userTwo.id,
        }
      }
    });
    expect(thesePermissions).not.toBe(null);
    expect(thesePermissions.read).toBe(false);
    expect(thesePermissions.write).toBe(true);

    // then send request
    const {body} = await api
      .get('/api/streams/read')
      .set('Authorization', `Bearer ${userTwo.token}`)
      .expect(200);

    // does not contain any data for streamTwo
    const isStreamTwo = body.find((entry) => entry.stream.id === streamTwo.id);
    expect(isStreamTwo).not.toBeDefined();
  });
});

describe('invalid requests (all streams)', () => {
  test('fails without token', async () => {
    const {body} = await api
      .get('/api/streams/read')
      .expect(401);

    expect(body.error).toBe('token missing');
  });

  test('fails with a bad token', async () => {
    const {body} = await api
      .get('/api/streams/read')
      .set('Authorization', `Bearer ${badToken}`)
      .expect(400);

    expect(body.error).toEqual('jwt malformed');
  });

  test('fails with an expired token', async () => {
    const {body} = await api
      .get('/api/streams/read')
      .set('Authorization', `Bearer ${expiredUserTwoToken}`)
      .expect(403);

    expect(body.error).toBe('login token has expired');
  });
});

describe('invalid requests (single stream)', () => {
  test('fails without token', async () => {
    const {body} = await api
      .get(`/api/streams/my-permissions/${streamZero.id}`)
      .expect(401);

    expect(body.error).toBe('token missing');
  });

  test('fails with a bad token', async () => {
    const {body} = await api
      .get(`/api/streams/my-permissions/${streamZero.id}`)
      .set('Authorization', `Bearer ${badToken}`)
      .expect(400);

    expect(body.error).toEqual('jwt malformed');
  });

  test('fails with an expired token', async () => {
    const {body} = await api
      .get(`/api/streams/my-permissions/${streamZero.id}`)
      .set('Authorization', `Bearer ${expiredUserTwoToken}`)
      .expect(403);

    expect(body.error).toBe('login token has expired');
  });

  test('fails when no id provided', async () => {
    await api
      .get('/api/streams/my-permissions/')
      .set('Authorization', `Bearer ${userTwo.token}`)
      .expect(404);
  });

  test('fails when bad id provided', async () => {
    await api
      .get(`/api/streams/my-permissions/${invalidId}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .expect(404);
  });

  test('fails when user has no permissions', async () => { // same response as id not found
    // new user with no permissions
    await addUser(user.six);
    const userSix = await logInUser(user.six);

    await api
      .get(`/api/streams/my-permissions/${streamZero.id}`)
      .set('Authorization', `Bearer ${userSix.token}`)
      .expect(404);
  });
});

afterAll(async () => {
  await sequelize.close();
});
