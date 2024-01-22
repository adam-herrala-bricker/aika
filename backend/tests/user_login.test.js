const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const {connectToDB, sequelize} = require('../util/db');
const {clearDB, addUser} = require('./util/functions');
const {user} = require('./util/constants');

beforeAll(async () => {
  // runs migrations
  await connectToDB();
});

beforeEach(async () => {
  await clearDB();
});

describe('valid requests', () => {
  beforeEach(async () => {
    await addUser(user.two);
  });

  test.only('login', async () => {
    const response = await api
      .post('/api/login')
      .send({
        username: user.two.username,
        password: user.two.password
      })
      .expect(200);

    console.log(response.body);

  });
  // log out

});

// invalid: wrong username, wrong password, disabled user, unconfirmed email

afterAll(async () => {
  await sequelize.close();
});

