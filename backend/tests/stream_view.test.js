const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const {connectToDB, sequelize} = require('../util/db');

beforeAll(async () => {
  // runs migrations and makes sure that all the relations are there
  await connectToDB();
});

// GET requests for /read
// Maybe also the /mine endpoint? Decide if we actually need it

afterAll(async () => {
  await sequelize.close();
});
