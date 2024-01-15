const {DataTypes} = require('sequelize');

module.exports = {
  up: async ({context: queryInterface}) => {
    await queryInterface.addColumn('users', 'email_confirmed', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  down: async ({context: queryInterface}) => {
    await queryInterface.removeColumn('users', 'email_confirmed');
  }
};
