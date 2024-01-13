require('dotenv').config();

const DB_URI_DEV = process.env.DB_URI_DEV;

const PORT = process.env.PORT;

const ADMIN_KEY = process.env.ADMIN_KEY;
const USER_SECRET = process.env.USER_SECRET;

module.exports = {
  ADMIN_KEY,
  DB_URI_DEV,
  PORT,
  USER_SECRET,
};
