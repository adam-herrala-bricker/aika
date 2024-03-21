// also includes tests for modifying user entry (as initiated by user)
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const {ActiveConfirmation, Slice, Stream, User} = require('../models');
const {connectToDB, sequelize} = require('../util/db');
const {clearDB, addUser, logInUser, addSlice, addStream} = require('./util/functions');
const {badToken, expiredUserTwoToken, newPassword, slice, stream, user} = require('./util/constants');

beforeAll(async () => {
  // this runs migrations and makes sure that all the relations are there
  await connectToDB();
});

beforeEach(async () => {
  await clearDB();
});

describe('valid user requests', () => {
  test('new user initializes', async () => {
    const response = await api
      .post('/api/users')
      .send(user.one)
      .expect(200);

    const userReturned = response.body;
    expect(userReturned.id).toBeDefined();

    // get created entry from DB
    const userDB = await User.findByPk(userReturned.id);

    // expect that user ID to find an entry
    expect(userDB).toBeDefined();

    // provided data returned and in DB (plus same id)
    const returnedFields = ['username', 'firstName', 'lastName', 'email'];
    returnedFields.forEach((field) => {
      expect(userReturned[field]).toBe(user.one[field]);
      expect(userDB[field]).toBe(user.one[field]);
    });

    // nothing else returned
    const expectedReturnLength = 5;
    expect(Object.keys(userReturned)).toHaveLength(expectedReturnLength);
    expect(userReturned.password).toBeUndefined;
    expect(userReturned.passwordHash).toBeUndefined;

    // stores password hash, not the password
    expect(userDB.password).toBeUndefined();
    expect(userDB.passwordHash).toBeDefined();
    expect(Object.values(userDB.dataValues)).not.toContain(user.one.password); // note how we get an array of the values in the DB

    // other fields set in DB as expected
    expect(userDB.emailConfirmed).toBe(false); // important: email is not confirmed by default!
    expect(userDB.isDisabled).toBe(false);
    expect(userDB.createdAt).toBeDefined();
    expect(userDB.updatedAt).toBeDefined();
  });

  test('email confirmation "link" works', async () => {
    // create new user
    const responseUser = await api
      .post('/api/users')
      .send(user.one)
      .expect(200);

    const userId = responseUser.body.id;

    // cannot log in before confirming email
    const responseBadLogin = await api
      .post('/api/login')
      .send({
        username: user.one.username,
        password: user.one.password
      })
      .expect(403);

    expect(responseBadLogin.body.error).toBe('user email not confirmed');

    // get confirmation key directly from DB
    const confirmation = await ActiveConfirmation.findOne({where: {userId}});

    // confirmation static page is there (the trailing / is added by express)
    await api
      .get(`/email-confirmation/${confirmation.key}/`)
      .expect(200);

    // "click on" the confirmation link
    await api
      .post(`/confirm/${confirmation.key}`)
      .expect(200);

    // check that the email is confirmed in the DB
    const thisUser = await User.findByPk(userId);
    expect(thisUser.emailConfirmed).toBe(true);

    // now can log in
    await api
      .post('/api/login')
      .send({
        username: user.one.username,
        password: user.one.password
      })
      .expect(200);
  });

  test('user can change their own password', async () => {
    // add + login user to change
    await addUser(user.two);
    const thisUser = await logInUser(user.two);

    // request to change password
    await api
      .put('/api/users/change-password')
      .set('Authorization', `Bearer ${thisUser.token}`)
      .send({
        oldPassword: user.two.password,
        newPassword: newPassword
      })
      .expect(200);

    // cannot log in with old password
    const logInOld = await api
      .post('/api/login')
      .send({
        username: user.two.username,
        password: user.two.password
      })
      .expect(404);

    expect(logInOld.body.error).toBe('username or password incorrect');

    // can log in with new password
    await api
      .post('/api/login')
      .send({
        username: user.two.username,
        password: newPassword
      })
      .expect(200);
  });

  test('user can delete themselves', async () => {
    // add + login user to delete
    await addUser(user.two);
    const thisUser = await logInUser(user.two);

    // add stream + slice (need to check it can remove all user data)
    const thisStream = await addStream(user.two, stream.zero);
    await addSlice(thisUser, thisStream.id, slice.valid.zero);

    // request to delete
    await api
      .delete('/api/users/')
      .set('Authorization', `Bearer ${thisUser.token}`)
      .send({password: user.two.password})
      .expect(204);

    // confirm that the user is gone
    const isUser = await User.findByPk(thisUser.id);
    expect(isUser).toBe(null);

    // confirm the stream is gone
    const isStream = await Stream.findOne({where: {creatorId: thisUser.id}});
    expect(isStream).toBe(null);

    // confirm the slice is gone
    const isSlice = await Slice.findOne({where: {creatorId: thisUser.id}});
    expect(isSlice).toBe(null);
  });
});

// invalid user requests (include malicious attempts to set limit higher or confirm email using the api)
describe('invalid user requests', () => {
  describe('creation - duplicate info', () => {
    beforeEach(async () => {
      // add user.zero to DB
      await addUser(user.zero);
    });

    test('duplicate username', async () => {
      // try to create user with same name as user.zero
      const response = await api
        .post('/api/users')
        .send({
          ...user.one,
          username: user.zero.username
        })
        .expect(400);

      expect(response.body.error).toContain('username already taken');
    });

    test('duplicate email', async () => {
      // try to create use with same email as user.zero
      const response = await api
        .post('/api/users')
        .send({
          ...user.one,
          email: user.zero.email
        })
        .expect(400);

      expect(response.body.error).toContain('email already taken');
    });
  });

  describe('creation - missing info', () => {
    test('missing username', async () => {
      const userCopy = {...user.zero};
      delete userCopy.username;

      const response = await api
        .post('/api/users')
        .send(userCopy)
        .expect(400);

      expect(response.body.error).toContain('user.username cannot be null');
    });

    test('missing fist name', async () => {
      const userCopy = {...user.zero};
      delete userCopy.firstName;

      const response = await api
        .post('/api/users')
        .send(userCopy)
        .expect(400);

      expect(response.body.error).toContain('user.firstName cannot be null');
    });

    test('missing last name', async () => {
      const userCopy = {...user.zero};
      delete userCopy.lastName;

      const response = await api
        .post('/api/users')
        .send(userCopy)
        .expect(400);

      expect(response.body.error).toContain('user.lastName cannot be null');
    });

    test('missing email', async () => {
      const userCopy = {...user.zero};
      delete userCopy.email;

      const response = await api
        .post('/api/users')
        .send(userCopy)
        .expect(400);

      expect(response.body.error).toContain('user.email cannot be null');
    });

    test('missing password', async () => {
      const userCopy = {...user.zero};
      delete userCopy.password;

      const response = await api
        .post('/api/users')
        .send(userCopy)
        .expect(400);

      expect(response.body.error).toContain('data and salt arguments required');
    });
  });

  describe('malicious requests', () => {
    test('cannot set isDisabled', async () => {
      const response = await api
        .post('/api/users')
        .send({
          ...user.zero,
          isDisabled: true
        })
        .expect(200);

      const userReturned = response.body;

      // check against entry in DB
      const userDB = await User.findByPk(userReturned.id);
      expect(userDB.isDisabled).toBe(false);
    });

    test('cannot set emailConfirmed', async () => {
      const response = await api
        .post('/api/users')
        .send({
          ...user.zero,
          emailConfirmed: true
        })
        .expect(200);

      const userReturned = response.body;

      // check against entry in DB
      const userDB = await User.findByPk(userReturned.id);
      expect(userDB.emailConfirmed).toBe(false);
    });

    test('cannot set storageLimit', async () => {
      const response = await api
        .post('/api/users')
        .send({
          ...user.zero,
          storageLimit: 100
        })
        .expect(200);

      const userReturned = response.body;

      // check against entry in DB
      const userDB = await User.findByPk(userReturned.id);
      expect(userDB.storageLimit).toBe(10);
    });
  });

  describe('invalid deletion', () => {
    let thisUser; // user we'll check hasn't been deleted each time

    beforeEach(async () => {
      // add + login user to delete
      await addUser(user.two);
      thisUser = await logInUser(user.two);
    });

    test('cannot delete without token', async () => {
      const {body} = await api
        .delete('/api/users')
        .expect(401);

      expect(body.error).toBe('token missing');

      // user is still in DB
      const isUser = await User.findByPk(thisUser.id);
      expect(isUser.id).toBe(thisUser.id);
    });

    test('cannot delete with a bad token', async () => {
      const {body} = await api
        .delete('/api/users')
        .set('Authorization', `Bearer ${badToken}`)
        .expect(400);

      expect(body.error).toBe('jwt malformed');

      // user is still in DB
      const isUser = await User.findByPk(thisUser.id);
      expect(isUser.id).toBe(thisUser.id);
    });

    test('cannot delete with expired token', async () => {
      const {body} = await api
        .delete('/api/users')
        .set('Authorization', `Bearer ${expiredUserTwoToken}`)
        .expect(403);

      expect(body.error).toBe('login token has expired');

      // user is still in DB
      const isUser = await User.findByPk(thisUser.id);
      expect(isUser.id).toBe(thisUser.id);

    });

    test('cannot delete without providing password', async () => {
      // request to delete
      const {body} = await api
        .delete('/api/users/')
        .set('Authorization', `Bearer ${thisUser.token}`)
        .expect(400);

      expect(body.error).toBe('password required');

      // user is still in DB
      const isUser = await User.findByPk(thisUser.id);
      expect(isUser.id).toBe(thisUser.id);
    });

    test('cannot delete if password is incorrect', async () => {
      // request to delete
      const {body} = await api
        .delete('/api/users/')
        .set('Authorization', `Bearer ${thisUser.token}`)
        .send({password: 'this_is_the_wrong_password'})
        .expect(404);

      expect(body.error).toBe('password incorrect');

      // user is still in DB
      const isUser = await User.findByPk(thisUser.id);
      expect(isUser.id).toBe(thisUser.id);
    });

    test('can only delete self', async () => {
      // add + log in second user
      await addUser(user.five);
      const userFive = await logInUser(user.five);

      // delete request
      await api
        .delete('/api/users')
        .set('Authorization', `Bearer ${userFive.token}`)
        .send({password: user.five.password})
        .expect(204);

      // user five is gone
      const userFiveEntry = await User.findByPk(userFive.id);
      expect(userFiveEntry).toBe(null);

      // but user two is still there
      const userTwoEntry = await User.findByPk(thisUser.id);
      expect(userTwoEntry.id).toBe(thisUser.id);
    });

  });

  describe('invalid password change', () => {
    let thisUser; // user whose password we'll try to change

    beforeEach(async () => {
      // add + login user two
      await addUser(user.two);
      thisUser = await logInUser(user.two);
    });

    test('no old password provided', async () => {
      const {body} = await api
        .put('/api/users/change-password')
        .set('Authorization', `Bearer ${thisUser.token}`)
        .send({
          newPassword: newPassword
        })
        .expect(400);

      expect(body.error).toBe('old and new passwords required');
    });

    test('no new password provided', async () => {
      const {body} = await api
        .put('/api/users/change-password')
        .set('Authorization', `Bearer ${thisUser.token}`)
        .send({
          oldPassword: user.two.password
        })
        .expect(400);

      expect(body.error).toBe('old and new passwords required');
    });

    test('no token', async () => {
      const {body} = await api
        .put('/api/users/change-password')
        .send({
          oldPassword: user.two.password,
          newPassword: newPassword
        })
        .expect(401);

      expect(body.error).toBe('token missing');
    });

    test('bad token', async () => {
      const {body} = await api
        .put('/api/users/change-password')
        .set('Authorization', `Bearer ${badToken}`)
        .send({
          oldPassword: user.two.password,
          newPassword: newPassword
        })
        .expect(400);

      expect(body.error).toBe('jwt malformed');
    });

    test('expired token', async () => {
      const {body} = await api
        .put('/api/users/change-password')
        .set('Authorization', `Bearer ${expiredUserTwoToken}`)
        .send({
          oldPassword: user.two.password,
          newPassword: newPassword
        })
        .expect(403);

      expect(body.error).toBe('login token has expired');
    });

    test('token for different user than password', async () => {
      // log in a second user
      await addUser(user.five);
      const userFive = await logInUser(user.five);

      // now the request
      const {body} = await api
        .put('/api/users/change-password')
        .set('Authorization', `Bearer ${userFive.token}`)
        .send({
          oldPassword: user.two.password,
          newPassword: newPassword
        })
        .expect(404);

      expect(body.error).toBe('password incorrect');
    });

    test('old password is wrong', async () => {
      const {body} = await api
        .put('/api/users/change-password')
        .set('Authorization', `Bearer ${thisUser.token}`)
        .send({
          oldPassword: 'this_is_not_the_correct_password',
          newPassword: newPassword
        })
        .expect(404);

      expect(body.error).toBe('password incorrect');
    });

    afterEach(async () => {
      // verify that the user cannot log in with the new password
      const {body} = await api
        .post('/api/login')
        .send({
          username: user.two.username,
          password: newPassword
        })
        .expect(404);

      expect(body.error).toBe('username or password incorrect');

      // but they can still log in with the old one
      await api
        .post('/api/login')
        .send({
          username: user.two.username,
          password: user.two.password
        })
        .expect(200);
    });

  });

});

afterAll(async () => {
  await sequelize.close();
});
