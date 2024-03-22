const {readFile} = require('node:fs/promises');
const supertest = require('supertest');
const app = require('../../app');
const api = supertest(app);
const bcrypt = require('bcrypt');
const {Op} = require('sequelize');
const {StreamUser, User} = require('../../models');
const {basePath} = require('./constants');

// clears the test DB of all entries
const clearDB = async () => {
  await User.destroy({truncate: true, cascade: true});
};

// adds user to DB
const addUser = async (user) => {
  await User.create({
    ...user,
    passwordHash: await bcrypt.hash(user.password, 10)
  });
};

// creates the given stream as the given user (assumes user is already in DB)
// uses the API to also create the StreamUser object, as in normal operation
const addStream = async (user, stream) => {
  const {token} = await logInUser(user);
  const {body} = await api
    .post('/api/streams')
    .set('Authorization', `Bearer ${token}`)
    .send(stream);

  return body;
};

// creates a new slice on the given stream as the given user
// user object is that returned by logInUser
// (sends as multipart/form-data, without an image attachment)
const addSlice = async (user, streamId, slice) => {
  const {body} = await api
    .post(`/api/slices/${streamId}`)
    .set('Authorization', `Bearer ${user.token}`)
    .field(slice);

  return body;
};

// same as above, but with an image attachment
// (images are stored seperately from slice constants)
const addImageSlice = async (user, streamId, slice, imageName) => {
  const imageBuffer = await readFile(`${basePath}/${imageName}`);

  const {body} = await api
    .post(`/api/slices/${streamId}`)
    .set('Authorization', `Bearer ${user.token}`)
    .attach('image', imageBuffer, imageName)
    .field(slice)
    .expect(200);

  return body;
};

// logs the given user in, returns full user object
const logInUser = async (user) => {
  const {body} = await api
    .post('/api/login')
    .send({
      credentials: user.username,
      password: user.password
    });

  return body;
};

// creates (or updates) permissions for the given user and stream (with IDs included in both objects)
const createPermissions = async (user, stream, permissions) => {
  // check to see if there's already an entry there
  const permissionsDB = await StreamUser.findOne({
    where:
    {[Op.and]: {
      userId: user.id,
      streamId: stream.id
    }}});

  if (!permissionsDB) { // create new if not
    await StreamUser.create({
      ...permissions,
      userId: user.id,
      streamId: stream.id,
    });
  } else { // otherwise can just update
    ['read', 'write', 'deleteOwn', 'deleteAll', 'admin'].forEach((per) => {
      if (permissions[per] !== undefined) permissionsDB[per] = permissions[per];
    });

    await permissionsDB.save();
  }
};

// removes all permissions from DB for given user + stream (both objects need IDs)
const clearPermissions = async (user, stream) => {
  await StreamUser.destroy({
    where: {
      [Op.and]: {
        userId: user.id,
        streamId: stream.id
      }}
  });
};

module.exports = {
  addUser,
  addStream,
  addSlice,
  addImageSlice,
  clearDB,
  clearPermissions,
  createPermissions,
  logInUser,
};
