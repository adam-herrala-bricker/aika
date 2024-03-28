const {DataTypes} = require('sequelize');

module.exports = {
  up: async ({context: queryInterface}) => {
    await queryInterface.createTable('strands', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      creator_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {model: 'users', key: 'id'}
      },

      name: {
        type: DataTypes.TEXT,
        allowNull: false
      },

      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },

      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    await queryInterface.addColumn('slices', 'strand_id', {
      type: DataTypes.UUID,
      references: {model: 'strands', key: 'id'},
      allowNull: true
    });
  },

  down: async ({context: queryInterface}) => {
    await queryInterface.removeColumn('slices', 'strand_id');
    await queryInterface.dropTable('strands');
  }
};
