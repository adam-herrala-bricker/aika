const {User} = require('../../models');

// clears the test DB of all entries
const clearDB = async () => {
  await User.destroy({truncate: true, cascade: true});
};

// adds array of users to DB
const addUsers = async (userArray) => {
  userArray.forEach(async (user) => {
    await User.create(user);
  });
};

module.exports = {addUsers, clearDB};
