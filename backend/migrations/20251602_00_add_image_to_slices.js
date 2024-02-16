const {DataTypes} = require('sequelize');

module.exports = {
  up: async ({context: queryInterface}) => {
    await queryInterface.addColumn('slices', 'image_data', {
      type: DataTypes.BLOB('long'),
      allowNull: true
    });

    await queryInterface.addColumn('slices', 'image_name', {
      type: DataTypes.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('slices', 'image_type', {
      type: DataTypes.TEXT,
      allowNull: true
    });
  },

  down: async ({context: queryInterface}) => {
    await queryInterface.removeColumn('slices', 'image_data');
    await queryInterface.removeColumn('slices', 'image_name');
    await queryInterface.removeColumn('slices', 'image_type');
  }
};