require('dotenv').config();

const PORT = process.env.PORT;

const DEPLOY_KEY = process.env.DEPLOY_KEY;

module.exports = {
  DEPLOY_KEY,
  PORT
};
