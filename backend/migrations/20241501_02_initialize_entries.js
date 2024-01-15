const {DataTypes} = require('sequelize');

module.exports = {
  up: async ({context: queryInterface}) => {
    await queryInterface.createTable('entries', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      title: {
        type: DataTypes.TEXT,
        validate: {
          len: [0,32]
        }
      },

      text: {
        type: DataTypes.TEXT,
        vaildate: {
          len: [0, 512]
        }
      },

      is_public: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },

      is_milestone: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      creator_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {model: 'users', key: 'id'}
      },

      stream_id : {
        type: DataTypes.UUID,
        allowNull: false,
        references: {model: 'streams', key: 'id'}
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
    await queryInterface.dropTable('entries');
  }
};
