const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const {ActiveConfirmation, User} = require('../models');
const {connectToDB, sequelize} = require('../util/db');
const {clearDB, addUsers} = require('./util/functions');
const {user} = require('./util/constants');

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

    // duplicate names and PWs are fine
  });
});

// invalid user requests (include malicious attempts to set limit higher or confirm email using the api)
describe('invalid user requests', () => {
  describe('duplicate info', () => {
    beforeEach(async () => {
      // add user.zero to DB
      await addUsers([user.zero]);
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

      expect(response.body.error).toContain('entry must be unique');
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

      expect(response.body.error).toContain('entry must be unique');
    });
  });

  describe('missing info', () => {
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
});

afterAll(async () => {
  await sequelize.close();
});
