const {DataTypes, Model} = require('sequelize');
const {sequelize} = require('../util/db');

class ActiveSession extends Model {}

ActiveSession.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  token: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'activeSession'
});

module.exports = ActiveSession;
