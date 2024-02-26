require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV;

const DB_URI_DEV = process.env.DB_URI_DEV;
const DB_URI_TESTING = process.env.DB_URI_TESTING;
const DB_URI_PRODUCTION = process.env.DB_URI_PRODUCTION;

const DB_URI = NODE_ENV === 'production'
  ? DB_URI_PRODUCTION
  : NODE_ENV === 'development'
    ? DB_URI_DEV
    : DB_URI_TESTING; // fine to have testing as fallthrough, since it's constantly being cleared


const PORT = process.env.PORT;

const ADMIN_KEY = process.env.ADMIN_KEY;
const USER_SECRET = process.env.USER_SECRET;

const NT_EMAIL_PASSWORD = process.env.NT_EMAIL_PASSWORD;


module.exports = {
  ADMIN_KEY,
  DB_URI,
  NODE_ENV,
  NT_EMAIL_PASSWORD,
  PORT,
  USER_SECRET,
};
