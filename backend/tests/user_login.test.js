const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const {connectToDB, sequelize} = require('../util/db');
const {ActiveSession} = require('../models');
const {clearDB, addUser} = require('./util/functions');
const {user} = require('./util/constants');

beforeAll(async () => {
  // runs migrations
  await connectToDB();
});

beforeEach(async () => {
  await clearDB();
  await addUser(user.two);
});

describe('valid requests', () => {
  test('login', async () => {
    const {body} = await api
      .post('/api/login')
      .send({
        username: user.two.username,
        password: user.two.password
      })
      .expect(200);

    // returns expected content
    expect(body.id).toBeDefined();
    expect(body.token).toBeDefined();
    expect(body.username).toEqual(user.two.username);

    // verify active session stored in DB
    const thisSession = await ActiveSession.findOne({where: {token: body.token}});
    expect(thisSession).not.toBeNull();
    expect(thisSession.userId).toBe(body.id);

  });

  test('logout', async () => {
    // log in first
    const {body} = await api
      .post('/api/login')
      .send({
        username: user.two.username,
        password: user.two.password
      })
      .expect(200);

    // now log out
    await api
      .delete('/api/login/')
      .set('Authorization', `Bearer ${body.token}`)
      .expect(204);

    // verify that there is no longer an active session with that token
    const thisSession = await ActiveSession.findOne({where: {token: body.token}});
    expect(thisSession).toBeNull();

    // trying to log out with expired token gets recognized by the authorization MW
    const response = await api
      .delete('/api/login/')
      .set('Authorization', `Bearer ${body.token}`)
      .expect(403);

    expect(response.body.error).toContain('login token has expired');
  });
});

describe('invalid requests', () => {
  test('wrong username', async () => {
    const {body} = await api
      .post('/api/login')
      .send({
        username: 'wrong.username',
        password: user.two.password
      })
      .expect(404);

    expect(body.error).toContain('username or password incorrect');
  });

  test('wrong password', async () => {
    const {body} = await api
      .post('/api/login')
      .send({
        username: user.two.username,
        password: 'wrongPassword1138'
      })
      .expect(404);

    expect(body.error).toContain('username or password incorrect');
  });

  test('username and password from different users', async () => {
    // need user.three just this once
    await addUser(user.three);

    const {body} = await api
      .post('/api/login')
      .send({
        username: user.two.username,
        password: user.three.password
      })
      .expect(404);

    expect(body.error).toContain('username or password incorrect');
  });

  test('disabled user', async () => {
    // this time need user.four
    await addUser(user.four);

    const {body} = await api
      .post('/api/login')
      .send({
        username: user.four.username,
        password: user.four.password,
      })
      .expect(403);

    expect(body.error).toContain('user disabled');
  });

  test('unconfirmed email', async () => {
    // add user.zero this time
    await addUser(user.zero);

    const {body} = await (api)
      .post('/api/login')
      .send({
        username: user.zero.username,
        password: user.zero.password
      })
      .expect(403);

    expect(body.error).toContain('user email not confirmed');
  });
});

afterAll(async () => {
  await sequelize.close();
});

