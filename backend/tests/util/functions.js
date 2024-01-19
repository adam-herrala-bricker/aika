const {User} = require('../../models');

// clears the test DB of all entries
const clearDB = async () => {
  await User.destroy({truncate: true, cascade: true});
};

module.exports = {clearDB};
