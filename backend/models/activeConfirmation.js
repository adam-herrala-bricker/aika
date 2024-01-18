const {DataTypes, Model} = require('sequelize');
const {sequelize} = require('../util/db');

class ActiveConfirmation extends Model {}

ActiveConfirmation.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  key: {
    type: DataTypes.TEXT,
    allowNull: false
  },

}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'activeConfirmation'
});

module.exports = ActiveConfirmation;
