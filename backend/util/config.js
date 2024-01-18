require('dotenv').config();

const DB_URI_DEV = process.env.DB_URI_DEV;
const DB_URI_TESTING = process.env.DB_URI_TESTING;

const DB_URI = process.env.NODE_ENV === 'development'
  ? DB_URI_DEV
  : DB_URI_TESTING;


const PORT = process.env.PORT;

const ADMIN_KEY = process.env.ADMIN_KEY;
const USER_SECRET = process.env.USER_SECRET;

module.exports = {
  ADMIN_KEY,
  DB_URI,
  PORT,
  USER_SECRET,
};
