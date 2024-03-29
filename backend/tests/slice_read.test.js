const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const {connectToDB, sequelize} = require('../util/db');
const {
  addImageSlice,
  addSlice,
  addStream,
  addUser,
  clearDB,
  clearPermissions,
  createPermissions,
  logInUser
} = require('./util/functions');

const {
  badToken,
  expiredUserTwoToken,
  fileName,
  invalidId,
  slice,
  strand,
  stream,
  user
} = require('./util/constants');

// user objects
let userTwo; // creator, has permissions
let userFive; // non-creator, lacks permissions

// stream object
let streamZero;

// slice objects
let sliceZero;
let sliceOne;

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

  // add five slices to streamZero (as userTwo), one of which is an image
  // note that slice.one and slice.four are on strand.one, and slice.two is on strand.two
  sliceZero = await addImageSlice(userTwo, streamZero.id, slice.valid.zero, fileName.good.jpg.one);
  sliceOne = await addSlice(userTwo, streamZero.id, {...slice.valid.one, strandName: strand.one.name});
  await addSlice(userTwo, streamZero.id, {...slice.valid.two, strandName: strand.two.name});
  await addSlice(userTwo, streamZero.id, slice.valid.four); // skipping public
  await addSlice(userTwo, streamZero.id, {...slice.valid.five, strandName: strand.one.name});

});

describe('valid requests', () => {
  // note: default limit is 10, so should display all 4 in this case
  test('view with no limit or offset given', async () => {
    const {body} = await api
      .post(`/api/slices/view/${streamZero.id}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .expect(200);

    console.log(body);
    // note that order matters: it should be display most recent first
    expect(body).toMatchObject([slice.valid.five, slice.valid.four, slice.valid.two, slice.valid.one, slice.valid.zero]);

    // image metadata returned for slice.zero
    const sliceZeroBody = body[4];
    expect(sliceZeroBody.imageName).toBe(fileName.good.jpg.one);
    expect(sliceZeroBody.imageType).toBe('image/jpeg');
    expect(sliceZeroBody).not.toHaveProperty('imageData');

    // returns creating user
    body.forEach((slice) => {
      expect(slice.user.username).toBe(userTwo.username);
    });

    // slices not on strands have no strand data
    expect(body[1].strandId).toBe(null);
    expect(body[1].strand).toBe(null);
    expect(body[4].strandId).toBe(null);
    expect(body[4].strand).toBe(null);

    // slices on strands return expected data
    expect(body[0].strandId).toBe(sliceOne.strandId);
    expect(body[0].strand.name).toBe(strand.one.name);
    expect(body[2].strandId).not.toBe(null);
    expect(body[2].strand.name).toBe(strand.two.name);
    expect(body[3].strandId).toBe(sliceOne.strandId);
    expect(body[3].strand.name).toBe(strand.one.name);

  });

  test('view with limit given', async () => {
    const {body} = await api
      .post(`/api/slices/view/${streamZero.id}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .send({limit: 2})
      .expect(200);

    expect(body).toMatchObject([slice.valid.five, slice.valid.four]);

    // returns creating user too
    body.forEach((slice) => {
      expect(slice.user.username).toBe(userTwo.username);
    });
  });

  test('view with offset given', async () => {
    const {body} = await api
      .post(`/api/slices/view/${streamZero.id}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .send({offset: 2})
      .expect(200);

    expect(body).toMatchObject([slice.valid.two, slice.valid.one, slice.valid.zero]);

    // returns creating user too
    body.forEach((slice) => {
      expect(slice.user.username).toBe(userTwo.username);
    });
  });

  test('view with limit and offset given', async () => {
    const {body} = await api
      .post(`/api/slices/view/${streamZero.id}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .send({
        limit: 2,
        offset: 1
      })
      .expect(200);

    expect(body).toMatchObject([slice.valid.four, slice.valid.two]);

    // returns creating user too
    body.forEach((slice) => {
      expect(slice.user.username).toBe(userTwo.username);
    });
  });

  test('search term queries title + text', async () => {
    const {body} = await api
      .post(`/api/slices/view/${streamZero.id}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .send({
        search: 'title'
      })
      .expect(200);

    // these two slices have 'title' in them
    expect(body).toMatchObject([slice.valid.one, slice.valid.zero]);
  });

  test('empty string search returns all slices', async () => {
    const {body} = await api
      .post(`/api/slices/view/${streamZero.id}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .send({
        search: ''
      })
      .expect(200);

    // all slices on stream
    expect(body).toMatchObject([slice.valid.five, slice.valid.four, slice.valid.two, slice.valid.one, slice.valid.zero]);
  });

  test('single strand view', async () => {
    const {body} = await api
      .post(`/api/slices/view/${streamZero.id}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .send({
        strandId: sliceOne.strandId
      })
      .expect(200);

    // note the order here is the reverse of a regular slice query
    expect(body).toMatchObject([slice.valid.one, slice.valid.five]);

    expect(body[0].strandId).toBe(sliceOne.strandId);
    expect(body[1].strandId).toBe(sliceOne.strandId);

    expect(body[0].strand.name).toBe(strand.one.name);
    expect(body[1].strand.name).toBe(strand.one.name);
  });

  test('single strand + search', async () => {
    const {body} = await api
      .post(`/api/slices/view/${streamZero.id}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .send({
        strandId: sliceOne.strandId,
        search: 'ordinary'
      })
      .expect(200);

    expect(body).toMatchObject([slice.valid.five]);
    expect(body[0].strandId).toBe(sliceOne.strandId);
    expect(body[0].strand.name).toBe(strand.one.name);
  });

  test('request to image src path (default --> web res)', async () => {
    // need to view slice on stream first
    await api
      .post(`/api/slices/view/${streamZero.id}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .expect(200);

    // then verify that the src path works
    await api
      .get(`/media/${streamZero.id}/${sliceZero.id}_web_${fileName.good.jpg.one}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .expect(200);
  });

  test('request to image src path (full res', async () => {
    // slice request
    await api
      .post(`/api/slices/view/${streamZero.id}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .send({res: 'full'})
      .expect(200);

    // media request
    await api
      .get(`/media/${streamZero.id}/${sliceZero.id}_full_${fileName.good.jpg.one}`)
      .set('Authorization', `Bearer ${userTwo.token}`)
      .expect(200);
  });
});

describe('invalid requests', () => {
  describe('POST to view stream', () => {
    test('missing token', async () => {
      const {body} = await api
        .post(`/api/slices/view/${streamZero.id}`)
        .expect(401);

      expect(body.error).toBe('token missing');
    });

    test('bad token', async () => {
      const {body} = await api
        .post(`/api/slices/view/${streamZero.id}`)
        .set('Authorization', `Bearer ${badToken}`)
        .expect(400);

      expect(body.error).toBe('jwt malformed');
    });

    test('expired token', async () => {
      const {body} = await api
        .post(`/api/slices/view/${streamZero.id}`)
        .set('Authorization', `Bearer ${expiredUserTwoToken}`)
        .expect(403);

      expect(body.error).toBe('login token has expired');
    });

    test('no permissions for stream', async () => {
      // make sure userFive has no permissions set for stream
      await clearPermissions(userFive, streamZero);

      // send request
      const {body} = await api
        .post(`/api/slices/view/${streamZero.id}`)
        .set('Authorization', `Bearer ${userFive.token}`)
        .expect(403);

      expect(body.error).toBe('no user permissions for this stream');
    });

    test('read permission set to false', async () => {
      // set read = false for userFive on streamZero
      await createPermissions(userFive, streamZero, {read: false});

      // send request
      const {body} = await api
        .post(`/api/slices/view/${streamZero.id}`)
        .set('Authorization', `Bearer ${userFive.token}`)
        .expect(403);

      expect(body.error).toBe('read permission required');
    });

    test('bad stream id', async () => {
      const {body} = await api
        .post(`/api/slices/view/${invalidId}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .expect(404);

      expect(body.error).toBe('stream not found');
    });
  });

  describe('GET for image src', () => {
    beforeAll(async () => {
      // viewing the stream --> temp image on server
      await api
        .post(`/api/slices/view/${streamZero.id}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .expect(200);
    });

    test('missing token', async () => {
      const {body} = await api
        .get(`/media/${streamZero.id}/${sliceZero.id}_web_${fileName.good.jpg.one}`)
        .expect(401);

      expect(body.error).toBe('token missing');
    });

    test('bad token', async () => {
      const {body} = await api
        .get(`/media/${streamZero.id}/${sliceZero.id}_web_${fileName.good.jpg.one}`)
        .set('Authorization', `Bearer ${badToken}`)
        .expect(400);

      expect(body.error).toBe('jwt malformed');
    });

    test('expired token', async () => {
      const {body} = await api
        .get(`/media/${streamZero.id}/${sliceZero.id}_web_${fileName.good.jpg.one}`)
        .set('Authorization', `Bearer ${expiredUserTwoToken}`)
        .expect(403);

      expect(body.error).toBe('login token has expired');
    });

    test('no permissions for stream', async () => {
      await clearPermissions(userFive, streamZero);

      const {body} = await api
        .get(`/media/${streamZero.id}/${sliceZero.id}_web_${fileName.good.jpg.one}`)
        .set('Authorization', `Bearer ${userFive.token}`)
        .expect(403);

      expect(body.error).toBe('no user permissions for this stream');
    });

    test('read permissions set to false', async () => {
      await createPermissions(userFive, streamZero, {read: false});

      const {body} = await api
        .get(`/media/${streamZero.id}/${sliceZero.id}_web_${fileName.good.jpg.one}`)
        .set('Authorization', `Bearer ${userFive.token}`)
        .expect(403);

      expect(body.error).toBe('read permissions required');
    });

    test('bad image path', async () => {
      await api
        .get(`/media/${streamZero.id}/${sliceZero.id}_web_${fileName.bad.jpg.one}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .expect(404);
    });
  });
});

afterAll(async () => {
  await sequelize.close();
});

