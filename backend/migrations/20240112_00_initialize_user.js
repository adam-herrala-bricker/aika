const {DataTypes} = require('sequelize');

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      username: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },

      first_name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      last_name: {
        type: DataTypes.TEXT,
        allowNull: false
      },

      email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },

      password_hash: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      is_disabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      storage_limit: {
        type: DataTypes.INTEGER,
        defaultValue: 10
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
    await queryInterface.dropTable('users');
  }
}