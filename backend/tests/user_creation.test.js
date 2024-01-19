const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const {ActiveConfirmation, User} = require('../models');
const {connectToDB, sequelize} = require('../util/db');
const {clearDB} = require('./util/functions');
const {user} = require('./util/constants');

beforeAll(async () => {
  // this runs migrations and makes sure that all the relations are there
  await connectToDB();
});

describe('valid user requests', () => {
  beforeEach(async () => {
    await clearDB();
  });

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
  });
});

// invalid user requests (include malicious attempts to set limit higher or confirm email using the api)

afterAll(async () => {
  await sequelize.close();
});
