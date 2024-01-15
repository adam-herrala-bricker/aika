const {DataTypes} = require('sequelize');

module.exports = {
  up: async ({context: queryInterface}) => {
    await queryInterface.createTable('streams', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      creator_id: {
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
    await queryInterface.dropTable('streams');
  }
};
