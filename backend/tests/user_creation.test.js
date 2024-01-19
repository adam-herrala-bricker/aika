const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const {clearDB} = require('./util/functions');
const {connectToDB, sequelize} = require('../util/db');

beforeAll(async () => {
  // this runs migrations and makes sure that all the relations are there
  await connectToDB();
});

describe('valid user requests', () => {
  beforeEach(async () => {
    await clearDB();
  });

  test('new user initializes', async () => {
    const userOne = {
      username: 'test.one',
      firstName: 'test',
      lastName: 'one',
      email: 'test.one@gmail.com',
      password: 'example'
    };

    const newUser = await api
      .post('/api/users')
      .send(userOne)
      .expect(200);

    console.log(newUser.body);
  });

  // initializes as email unconfirmed
  // email confirmation works
  // cannot log in before confirming email
  // can log in after confirming email

});

// invalid user requests

afterAll(async () => {
  await sequelize.close();
});
