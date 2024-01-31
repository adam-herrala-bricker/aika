const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const {connectToDB, sequelize} = require('../util/db');
const {addSlice, addStream, addUser, clearDB, clearPermissions, createPermissions, logInUser} = require('./util/functions');
const {badToken, expiredUserTwoToken, invalidId, slice, stream, user} = require('./util/constants');

// user objects
let userTwo; // creator, has permissions
let userFive; // non-creator, lacks permissions

// stream object
let streamZero;

beforeAll(async () => {
  await connectToDB();
  await clearDB();

  // add and log in users
  await addUser(user.two);
  await addUser(user.five);

  userTwo = await logInUser(user.two);
  userFive = await logInUser(user.five);

  // tests make no changes to streams or slices, so only need to add once
  streamZero = await addStream(user.two, stream.zero);

  // add four slices to streamZero (as userTwo)
  await addSlice(userTwo, streamZero.id, slice.valid.zero);
  await addSlice(userTwo, streamZero.id, slice.valid.one);
  await addSlice(userTwo, streamZero.id, slice.valid.two);
  await addSlice(userTwo, streamZero.id, slice.valid.four); // skipping public
});

describe('valid requests', () => {
  // note: default limit is 10, so should display all 4 in this case
  test('view with no limit or offset given', async () => {
    const {body} = await api
      .get(`/api/slices/${streamZero.id}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .expect(200);

    // note that order matters: it should be display most recent first
    expect(body).toMatchObject([slice.valid.four, slice.valid.two, slice.valid.one, slice.valid.zero]);
  });

  test('view with limit given', async () => {
    const {body} = await api
      .get(`/api/slices/${streamZero.id}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .send({limit: 2})
      .expect(200);

    expect(body).toMatchObject([slice.valid.four, slice.valid.two]);
  });

  test('view with offset given', async () => {
    const {body} = await api
      .get(`/api/slices/${streamZero.id}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .send({offset: 2})
      .expect(200);

    expect(body).toMatchObject([slice.valid.one, slice.valid.zero]);
  });

  test('view with limit and offset given', async () => {
    const {body} = await api
      .get(`/api/slices/${streamZero.id}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .send({
        limit: 2,
        offset: 1
      })
      .expect(200);

    expect(body).toMatchObject([slice.valid.two, slice.valid.one]);
  });
});

describe('invalid requests', () => {
  test('missing token', async () => {
    const {body} = await api
      .get(`/api/slices/${streamZero.id}`)
      .expect(401);

    expect(body.error).toBe('token missing');
  });

  test('bad token', async () => {
    const {body} = await api
      .get(`/api/slices/${streamZero.id}`)
      .set('Authorization', `Bearer ${badToken}`)
      .expect(400);

    expect(body.error).toBe('jwt malformed');
  });

  test('expired token', async () => {
    const {body} = await api
      .get(`/api/slices/${streamZero.id}`)
      .set('Authorization', `Bearer ${expiredUserTwoToken}`)
      .expect(403);

    expect(body.error).toBe('login token has expired');
  });

  test('no permissions for stream', async () => {
    // make sure userFive has no permissions set for stream
    await clearPermissions(userFive, streamZero);

    // send request
    const {body} = await api
      .get(`/api/slices/${streamZero.id}`)
      .set('Authorization', `Bearer ${userFive.token}`)
      .expect(403);

    expect(body.error).toBe('no user permissions for this stream');
  });

  test('read permission set to false', async () => {
    // set read = false for userFive on streamZero
    await createPermissions(userFive, streamZero, {read: false});

    // send request
    const {body} = await api
      .get(`/api/slices/${streamZero.id}`)
      .set('Authorization', `Bearer ${userFive.token}`)
      .expect(403);

    expect(body.error).toBe('read permission required');
  });

  test('bad stream id', async () => {
    const {body} = await api
      .get(`/api/slices/${invalidId}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .expect(404);

    expect(body.error).toBe('stream not found');
  });
});

afterAll(async () => {
  await sequelize.close();
});

