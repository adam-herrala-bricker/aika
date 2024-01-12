require('dotenv').config();

const DB_URI_DEV = process.env.DB_URI_DEV;

const PORT = process.env.PORT;

module.exports = {
  DB_URI_DEV,
  PORT
};
