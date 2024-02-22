require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV;

const DB_URI_DEV = process.env.DB_URI_DEV;
const DB_URI_TESTING = process.env.DB_URI_TESTING;

const DB_URI = NODE_ENV === 'development'
  ? DB_URI_DEV
  : DB_URI_TESTING;


const PORT = process.env.PORT;

const ADMIN_KEY = process.env.ADMIN_KEY;
const USER_SECRET = process.env.USER_SECRET;

const GMAIL_ADDRESS = process.env.GMAIL_ADDRESS;
const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const GMAIL_ACCESS_TOKEN = process.env.GMAIL_ACCESS_TOKEN;
const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

module.exports = {
  ADMIN_KEY,
  DB_URI,
  GMAIL_ADDRESS,
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_ACCESS_TOKEN,
  GMAIL_REFRESH_TOKEN,
  NODE_ENV,
  PORT,
  USER_SECRET,
};
