const {readFile} = require('node:fs/promises');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const {Slice} = require('../models');
const {connectToDB, sequelize} = require('../util/db');
const {
  addImageSlice,
  addSlice,
  addStream,
  addUser,
  logInUser,
  clearDB,
  clearPermissions,
  createPermissions
} = require('./util/functions');

const {
  badToken,
  basePath,
  expiredUserTwoToken,
  fileName,
  invalidId,
  slice,
  stream,
  user
} = require('./util/constants');

// user objects
let userTwo;
let userFive;

// stream objects
let streamZero;
let streamOne;

// slice object
let sliceToDelete;

beforeAll(async () => {
  // runs migrations and makes sure that all the relations are there
  await connectToDB();

  await clearDB();

  // add users and log them in
  await addUser(user.two);
  await addUser(user.five);
  userTwo = await logInUser(user.two);
  userFive = await logInUser(user.five);

  // add streams
  streamZero = await addStream(user.two, stream.zero);
  streamOne = await addStream(user.two, stream.one);

  // give userFive write permissions on streamZero (used at a number of points)
  await createPermissions(userFive, streamZero, {write: true});
});

describe('valid requests', () => {
  describe('create single slice ...', () => {
    describe('on own stream (json)', () => {
      test('title and text', async () => {
        const {body} = await api
          .post(`/api/slices/${streamZero.id}`)
          .set('Authorization', `Bearer ${userTwo.token}`)
          .send(slice.valid.zero)
          .expect(200);

        // get entry in DB
        const sliceDB = await Slice.findByPk(body.id);

        // expected data returned + in DB
        [body, sliceDB].forEach((entry) => {
          expect(entry.title).toBe(slice.valid.zero.title);
          expect(entry.text).toBe(slice.valid.zero.text);

          expect(entry.streamId).toBe(streamZero.id);
          expect(entry.creatorId).toBe(userTwo.id);

          expect(entry.isMilestone).toBe(false); // default value
          expect(entry.isPublic).toBe(false); // default value
          expect(entry).toHaveProperty('id');
          expect(entry).toHaveProperty('createdAt');
          expect(entry).toHaveProperty('updatedAt');
        });
      });

      test('title only', async () => {
        const {body} = await api
          .post(`/api/slices/${streamZero.id}`)
          .set('Authorization', `Bearer ${userTwo.token}`)
          .send(slice.valid.one)
          .expect(200);

        // get entry in DB
        const sliceDB = await Slice.findByPk(body.id);

        // expected data returned + in DB (only checking novel)
        [body, sliceDB].forEach((entry) => {
          expect(entry.title).toBe(slice.valid.one.title);
          expect(entry.text).toBe(null);
        });
      });

      test('text only', async () => {
        const {body} = await api
          .post(`/api/slices/${streamZero.id}`)
          .set('Authorization', `Bearer ${userTwo.token}`)
          .send(slice.valid.two)
          .expect(200);

        // get entry in DB
        const sliceDB = await Slice.findByPk(body.id);

        // expected data returned + in DB (only checking novel)
        [body, sliceDB].forEach((entry) => {
          expect(entry.text).toBe(slice.valid.two.text);
          expect(entry.title).toBe(null);
        });
      });

      test('public slice', async () => {
        const {body} = await api
          .post(`/api/slices/${streamZero.id}`)
          .set('Authorization', `Bearer ${userTwo.token}`)
          .send(slice.valid.three)
          .expect(200);

        // get entry in DB
        const sliceDB = await Slice.findByPk(body.id);

        // expected data returned + in DB (only checking novel)
        [body, sliceDB].forEach((entry) => {
          expect(entry.title).toBe(slice.valid.three.title);
          expect(entry.isPublic).toBe(true);
        });
      });

      test('milestone slice', async () => {
        const {body} = await api
          .post(`/api/slices/${streamZero.id}`)
          .set('Authorization', `Bearer ${userTwo.token}`)
          .send(slice.valid.four)
          .expect(200);

        // get entry in DB
        const sliceDB = await Slice.findByPk(body.id);

        // expected data returned + in DB (only checking novel)
        [body, sliceDB].forEach((entry) => {
          expect(entry.title).toBe(slice.valid.four.title);
          expect(entry.text).toBe(slice.valid.four.text);
          expect(entry.isMilestone).toBe(true);
        });
      });

      test('text + empty title', async () => {
        const {body} = await api
          .post(`/api/slices/${streamZero.id}`)
          .set('Authorization', `Bearer ${userTwo.token}`)
          .send(slice.valid.six)
          .expect(200);

        // get entry in DB
        const sliceDB = await Slice.findByPk(body.id);

        // expected data returned + in DB (only checking novel)
        [body, sliceDB].forEach((entry) => {
          expect(entry.title).toBe(slice.valid.six.title);
          expect(entry.text).toBe(slice.valid.six.text);
        });
      });

      test('title + empty text', async () => {
        const {body} = await api
          .post(`/api/slices/${streamZero.id}`)
          .set('Authorization', `Bearer ${userTwo.token}`)
          .send(slice.valid.seven)
          .expect(200);

        // get entry in DB
        const sliceDB = await Slice.findByPk(body.id);

        // expected data returned + in DB (only checking novel)
        [body, sliceDB].forEach((entry) => {
          expect(entry.title).toBe(slice.valid.seven.title);
          expect(entry.text).toBe(slice.valid.seven.text);
        });
      });
    });

    // not going to test every slice permutation here
    describe('on shared stream (json)', () => {
      test('ordinary slice', async () => {
        const {body} = await api
          .post(`/api/slices/${streamZero.id}`)
          .set('Authorization', `Bearer ${userFive.token}`)
          .send(slice.valid.five)
          .expect(200);

        // get entry in DB
        const sliceDB = await Slice.findByPk(body.id);

        // expected data returned + in DB
        [body, sliceDB].forEach((entry) => {
          expect(entry.title).toBe(slice.valid.five.title);
          expect(entry.text).toBe(slice.valid.five.text);

          expect(entry.streamId).toBe(streamZero.id);
          expect(entry.creatorId).toBe(userFive.id);

          expect(entry.isMilestone).toBe(false); // default value
          expect(entry.isPublic).toBe(false); // default value
          expect(entry).toHaveProperty('id');
          expect(entry).toHaveProperty('createdAt');
          expect(entry).toHaveProperty('updatedAt');
        });
      });
    });

    describe('on own stream (multipart/form-data)', () => {
      test('image only', async () => {
        // path from /backend (!!)
        const fileBuffer = await readFile(`${basePath}/${fileName.good.jpg.one}`);

        const {body} = await api
          .post(`/api/slices/${streamZero.id}`)
          .set('Authorization', `Bearer ${userTwo.token}`)
          .attach('image', fileBuffer, fileName.good.jpg.one)
          .expect(200);

        // returns expected body
        expect(body.imageName).toBe(fileName.good.jpg.one);
        expect(body.imageType).toBe('image/jpeg');
        expect(body.imageData).toBe(null); // this is critical
        expect(body.streamId).toBe(streamZero.id);
        expect(body.creatorId).toBe(userTwo.id);

        // expected data in DB
        const sliceDB = await Slice.findByPk(body.id);
        expect(sliceDB.imageName).toBe(fileName.good.jpg.one);
        expect(sliceDB.imageType).toBe('image/jpeg');
        expect(sliceDB.imageData).toBeDefined(); // data is here
        expect(sliceDB.imageData.byteLength).toBe(fileBuffer.byteLength);
        expect(sliceDB.streamId).toBe(streamZero.id);
        expect(sliceDB.creatorId).toBe(userTwo.id);
      });

      test('fields only', async () => {
        const {body} = await api
          .post(`/api/slices/${streamZero.id}`)
          .set('Authorization', `Bearer ${userTwo.token}`)
          .field(slice.valid.zero) // field --> multipart/form-data
          .expect(200);

        // expected body
        expect(body.title).toBe(slice.valid.zero.title);
        expect(body.text).toBe(slice.valid.zero.text);
        expect(body.isMilestone).toBe(false); // default
        expect(body.isPublic).toBe(false); // default
        expect(body.imageName).toBe(null);
        expect(body.imageType).toBe(null);
        expect(body.imageData).toBe(null);
        expect(body.streamId).toBe(streamZero.id);
        expect(body.creatorId).toBe(userTwo.id);

        // expected data in DB
        const sliceDB = await Slice.findByPk(body.id);
        expect(sliceDB.title).toBe(slice.valid.zero.title);
        expect(sliceDB.text).toBe(slice.valid.zero.text);
        expect(sliceDB.isMilestone).toBe(false); // default
        expect(sliceDB.isPublic).toBe(false); // default
        expect(sliceDB.imageName).toBe(null);
        expect(sliceDB.imageType).toBe(null);
        expect(sliceDB.imageData).toBe(null);
        expect(sliceDB.streamId).toBe(streamZero.id);
        expect(sliceDB.creatorId).toBe(userTwo.id);
      });

      test('image + fields', async () => {
        const fileBuffer = await readFile(`${basePath}/${fileName.good.jpg.one}`);

        const {body} = await api
          .post(`/api/slices/${streamZero.id}`)
          .set('Authorization', `Bearer ${userTwo.token}`)
          .attach('image', fileBuffer, fileName.good.jpg.one)
          .field(slice.valid.zero)
          .expect(200);

        // expected body
        expect(body.imageName).toBe(fileName.good.jpg.one);
        expect(body.imageType).toBe('image/jpeg');
        expect(body.imageData).toBe(null);
        expect(body.title).toBe(slice.valid.zero.title);
        expect(body.text).toBe(slice.valid.zero.text);
        expect(body.streamId).toBe(streamZero.id);
        expect(body.creatorId).toBe(userTwo.id);

        // expected data in DB
        const sliceDB = await Slice.findByPk(body.id);
        expect(sliceDB.imageName).toBe(fileName.good.jpg.one);
        expect(sliceDB.imageType).toBe('image/jpeg');
        expect(sliceDB.imageData).toBeDefined(); // data is here
        expect(sliceDB.imageData.byteLength).toBe(fileBuffer.byteLength);
        expect(sliceDB.title).toBe(slice.valid.zero.title);
        expect(sliceDB.text).toBe(slice.valid.zero.text);
        expect(sliceDB.streamId).toBe(streamZero.id);
        expect(sliceDB.creatorId).toBe(userTwo.id);
      });
    });
  });

  describe('slices accumulate as expected', () => {
    beforeEach(async () => {
      // need to remove all slices for length checks to work
      await Slice.destroy({truncate: true});
    });

    test('basic text slices', async () => {
      // slices to add
      const theseSlices = [
        slice.valid.zero,
        slice.valid.zero, // note the duplicate
        slice.valid.one,
        slice.valid.two
      ];

      // add them all
      for await (const thisSlice of theseSlices) {
        await api
          .post(`/api/slices/${streamZero.id}`)
          .set('Authorization', `Bearer ${userTwo.token}`)
          .send(thisSlice)
          .expect(200);
      }

      // check that the correct number are there
      const slicesDB = await Slice.findAll({where: {creatorId: userTwo.id}});
      expect(slicesDB).toHaveLength(theseSlices.length);
    });
  });

  describe('deletion...', () => {
    test('of own slice by stream creator', async () => {
      // add slice to delete (userTwo created streamZero)
      const thisSlice = await addSlice(userTwo, streamZero.id, slice.valid.zero);

      // request to delete
      await api
        .delete(`/api/slices/${thisSlice.id}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .expect(204);

      // confirm no longer in DB
      const foundSlice = await Slice.findByPk(thisSlice.id);
      expect(foundSlice).toBe(null);
    });

    test('of other users slice by stream creator', async () => {
      // add slice to delete (userFive did not create streamZero)
      const thisSlice = await addSlice(userFive, streamZero.id, slice.valid.zero);

      // request to delete
      await api
        .delete(`/api/slices/${thisSlice.id}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .expect(204);

      // confirm no longer in DB
      const foundSlice = await Slice.findByPk(thisSlice.id);
      expect(foundSlice).toBe(null);
    });

    test('of own slice on others stream with deleteOwn', async () => {
      // add slice to delete (userFive did not create streamZero)
      const thisSlice = await addSlice(userFive, streamZero.id, slice.valid.zero);

      // and make sure right permissions are set for userFive
      await createPermissions(userFive, streamZero, {deleteOwn: true});

      // request to delete
      await api
        .delete(`/api/slices/${thisSlice.id}`)
        .set('Authorization', `Bearer ${userFive.token}`)
        .expect(204);

      // confirm no longer in DB
      const foundSlice = await Slice.findByPk(thisSlice.id);
      expect(foundSlice).toBe(null);
    });

    test('of others slice on others stream with deleteAll', async () => {
      // add slice to delete (userTwo created streamZero)
      const thisSlice = await addSlice(userTwo, streamZero.id, slice.valid.zero);

      // make sure right permissions are set for userFive
      await createPermissions(userFive, streamZero, {deleteAll: true});

      // request to delete
      await api
        .delete(`/api/slices/${thisSlice.id}`)
        .set('Authorization', `Bearer ${userFive.token}`)
        .expect(204);

      // confirm no longer in DB
      const foundSlice = await Slice.findByPk(thisSlice.id);
      expect(foundSlice).toBe(null);
    });

    test('of image slice', async () => {
      // add slice to delete
      const thisSlice = await addImageSlice(
        userTwo,
        streamZero.id,
        slice.valid.zero,
        fileName.good.jpg.one
      );

      // delete request
      await api
        .delete(`/api/slices/${thisSlice.id}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .expect(204);

      // slice no longer in DB
      const foundSlice = await Slice.findByPk(thisSlice.id);
      expect(foundSlice).toBe(null);
    });
  });
});

describe('invalid requests', () => {
  describe('token errors', () => {
    describe('create with ...', () => {
      test('no token', async () => {
        const {body} = await api
          .post(`/api/slices/${streamZero.id}`)
          .send(slice.valid.zero)
          .expect(401);

        expect(body.error).toBe('token missing');
      });

      test('bad token', async () => {
        const {body} = await api
          .post(`/api/slices/${streamZero.id}`)
          .set('Authorization', `Bearer ${badToken}`)
          .send(slice.valid.zero)
          .expect(400);

        expect(body.error).toBe('jwt malformed');
      });

      test('expired token', async () => {
        const {body} = await api
          .post(`/api/slices/${streamZero.id}`)
          .set('Authorization', `Bearer ${expiredUserTwoToken}`)
          .send(slice.valid.zero)
          .expect(403);

        expect(body.error).toBe('login token has expired');
      });
    });

    describe('delete with ...', () => {
      beforeEach(async () => {
        // add slice to delete
        sliceToDelete = await addSlice(userTwo, streamZero.id, slice.valid.zero);
      });

      test('no token', async () => {
        const {body} =  await api
          .delete(`/api/slices/${sliceToDelete.id}`)
          .expect(401);

        expect(body.error).toBe('token missing');
      });

      test('bad token', async () => {
        const {body} =  await api
          .delete(`/api/slices/${sliceToDelete.id}`)
          .set('Authorization', `Bearer ${badToken}`)
          .expect(400);

        expect(body.error).toBe('jwt malformed');
      });

      test('expired token', async () => {
        const {body} = await api
          .delete(`/api/slices/${sliceToDelete.id}`)
          .set('Authorization', `Bearer ${expiredUserTwoToken}`)
          .expect(403);

        expect(body.error).toBe('login token has expired');
      });
    });
  });

  // note: we're using streamOne here so it doesn't interfer with the above permissions on streamZero
  describe('permission errors', () => {
    describe('create slice ...', () => {
      test('without any stream permissions', async () => {
        // make sure there are no permissions for userFive on streamOne
        await clearPermissions(userFive, streamOne);

        // send request
        const {body} = await api
          .post(`/api/slices/${streamOne.id}`)
          .set('Authorization', `Bearer ${userFive.token}`)
          .send(slice.valid.zero)
          .expect(403);

        expect(body.error).toBe('no user permissions for this stream');
      });

      test('with write = false', async () => {
        // set permissions
        await createPermissions(userFive, streamOne, {write: false});

        // send request
        const {body} = await api
          .post(`/api/slices/${streamOne.id}`)
          .set('Authorization', `Bearer ${userFive.token}`)
          .send(slice.valid.zero)
          .expect(403);

        expect(body.error).toBe('user cannot write to this stream');
      });
    });

    describe('delete slice ...', () => {
      beforeEach(async () => {
        // add slice to try to delete (again on streamOne)
        sliceToDelete = await addSlice(userTwo, streamOne.id, slice.valid.zero);
      });

      test('without any stream permissions', async () => {
        // clear all permissions
        await clearPermissions(userFive, streamOne);

        // send request
        const {body} = await api
          .delete(`/api/slices/${sliceToDelete.id}`)
          .set('Authorization', `Bearer ${userFive.token}`)
          .expect(403);

        expect(body.error).toBe('no user permissions for this stream');
      });

      test('with deleteOwn = false', async () => {
        // set permissions
        await createPermissions(userFive, streamOne, {write: true, deleteOwn: false});

        // userFive writes a slice
        const ownSlice = await addSlice(userFive, streamOne.id, slice.valid.one);

        // send request
        const {body} = await api
          .delete(`/api/slices/${ownSlice.id}`)
          .set('Authorization', `Bearer ${userFive.token}`)
          .expect(403);

        expect(body.error).toBe('user cannot delete this entry');
      });

      test('with deleteAll = false', async () => {
        // set permissions (here userFive can delete their own)
        await createPermissions(userFive, streamOne, {deleteOwn: true, deleteAll: false});

        // send request (to delete a slice that userFive did NOT create)
        const {body} = await api
          .delete(`/api/slices/${sliceToDelete.id}`)
          .set('Authorization', `Bearer ${userFive.token}`)
          .expect(403);

        expect(body.error).toBe('user cannot delete this entry');
      });
    });

    describe('other create errors', () => {
      test('title too long', async () => {
        const {body} = await api
          .post(`/api/slices/${streamZero.id}`)
          .set('Authorization', `Bearer ${userTwo.token}`)
          .send(slice.invalid.titleTooLong)
          .expect(400);

        expect(body.error).toContain('Validation len on title failed');
      });

      test('text too long', async () => {
        const {body} = await api
          .post(`/api/slices/${streamZero.id}`)
          .set('Authorization', `Bearer ${userTwo.token}`)
          .send(slice.invalid.textTooLong)
          .expect(400);

        expect(body.error).toContain('Validation len on text failed');
      });

      test('string for a boolean', async () => {
        const {body} = await api
          .post(`/api/slices/${streamZero.id}`)
          .set('Authorization', `Bearer ${userTwo.token}`)
          .send(slice.invalid.stringMilestone)
          .expect(400);

        expect(body.error).toContain('invalid input syntax for type boolean');
      });

      test('unrecognized property not passed to DB', async () => {
        const {body} = await api
          .post(`/api/slices/${streamZero.id}`)
          .set('Authorization', `Bearer ${userTwo.token}`)
          .send({
            ...slice.valid.zero,
            thisIsNotInTheModel: true
          })
          .expect(200);

        // property not returned
        expect(body).not.toHaveProperty('thisIsNotInTheModel');

        // property not in DB
        const sliceDB = await Slice.findByPk(body.id);
        expect(sliceDB).not.toHaveProperty('thisIsNotInTheModel');
      });
    });

    describe('file errors', () => {
      test('not permitted type', async () => {
        const thisName = fileName.good.txt.one;
        const fileBuffer = await readFile(`${basePath}/${thisName}`);

        const {body} = await api
          .post(`/api/slices/${streamZero.id}`)
          .set('Authorization', `Bearer ${userTwo.token}`)
          .attach('image', fileBuffer, thisName)
          .expect(400);

        expect(body.error).toBe('file type not permitted');
      });
    });

    describe('other delete errors', () => {
      test('unrecognized slice id', async () => {
        const {body} = await api
          .delete(`/api/slices/${invalidId}`)
          .set('Authorization', `Bearer ${userFive.token}`)
          .expect(404);

        expect(body.error).toBe('entry not found');
      });
    });
  });
});

afterAll(async () => {
  await sequelize.close();
});