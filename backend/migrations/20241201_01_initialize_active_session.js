const {DataTypes} = require('sequelize');

module.exports = {
  up: async ({context: queryInterface}) => {
    await queryInterface.createTable('active_sessions', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },

      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      },

      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {model: 'users', key: 'id'}
      }

    });
  },

  down: async ({context: queryInterface}) => {
    await queryInterface.dropTable('active_sessions');
  }
};
