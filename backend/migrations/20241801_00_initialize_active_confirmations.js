const {DataTypes} = require('sequelize');

module.exports = {
  up: async ({context: queryInterface}) => {
    await queryInterface.createTable('active_confirmations', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      key: {
        type: DataTypes.TEXT,
        allowNull: false
      },

      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {model: 'users', key: 'id'}
      },

      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },

      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
    });
  },

  down: async ({context: queryInterface}) => {
    await queryInterface.dropTable('active_confirmations');
  }
};