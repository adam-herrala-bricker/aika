// join table used for sharing and checking edit/delete permissions
const {DataTypes} = require('sequelize');

module.exports = {
  up: async ({context: queryInterface}) => {
    await queryInterface.createTable('stream_users', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      stream_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {model: 'streams', key: 'id'}
      },

      user_id: {
        type: DataTypes.UUID,
        allowNull:false,
        references: {model: 'users', key: 'id'}
      },

      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },

      write: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },

      delete_own: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },

      delete_all: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },

      admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    await queryInterface.dropTable('stream_users');
  }
};
