require('dotenv').config({path: '../.env'});

const DB_URI_DEV = process.env.DB_URI_DEV;

module.exports = {
  DB_URI_DEV
};
