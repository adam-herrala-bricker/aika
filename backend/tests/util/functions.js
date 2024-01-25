const supertest = require('supertest');
const app = require('../../app');
const api = supertest(app);
const bcrypt = require('bcrypt');
const {StreamUser, User} = require('../../models');

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
const addStream = async (user, stream) => {
  const {token} = await logInUser(user);
  const {body} = await api
    .post('/api/streams')
    .set('Authorization', `Bearer ${token}`)
    .send(stream);

  return body;
};

// logs the given user in, returns full user object
const logInUser = async (user) => {
  const {body} = await api
    .post('/api/login')
    .send({
      username: user.username,
      password: user.password
    });

  return body;
};

// creates *new* permissions for the given user and stream (with IDs included in both objects)
const createPermissions = async (user, stream, permissions) => {
  await StreamUser.create({
    ...permissions,
    userId: user.id,
    streamId: stream.id,
  });
};

module.exports = {addUser, addStream, clearDB, logInUser, createPermissions};
