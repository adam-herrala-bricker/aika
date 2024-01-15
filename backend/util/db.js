const Sequelize = require('sequelize');
const {Umzug, SequelizeStorage} = require('umzug');
const {DB_URI_DEV} = require('./config');

console.log(DB_URI_DEV);
// this is the sequelize instance that will be used everywhere
const sequelize = new Sequelize(DB_URI_DEV);

// config for migration
const migrationConf = {
  migrations: {
    glob: 'migrations/*.js'
  },
  storage: new SequelizeStorage({sequelize, tableName: 'migrations'}),
  context: sequelize.getQueryInterface(),
  logger:console,
};

// function to run migrations
const runMigrations = async () => {
  const migrator = new Umzug(migrationConf);

  const migrations = await migrator.up();
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  });
};

// and function to roll migrations back
const rollbackMigrations = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down();
};

// function to run when the app starts up
const connectToDB = async () => {
  try {
    console.log('connecting to', DB_URI_DEV);
    await sequelize.authenticate();
    console.log('successfully connected to DB!');
    await runMigrations();
  } catch (error) {
    console.log('failed to connect to DB');
    console.log(error);
    return process.exit(1);
  }

  return null;
};

module.exports = {connectToDB, rollbackMigrations, sequelize};
