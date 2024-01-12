const Sequelize = require('sequelize');
const {DB_URI_DEV} = require('./config');

console.log(DB_URI_DEV);
const sequelize = new Sequelize(DB_URI_DEV);

const connectToDB = async () => {
  try {
    console.log('connecting to', DB_URI_DEV);
    await sequelize.authenticate();
    console.log('successfully connected to DB!')
  } catch (error) {
    console.log('failed to connect to DB');
    console.log(error);
    return process.exit(1);
  }

  return null;
};

connectToDB();