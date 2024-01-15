const {DataTypes, Model} = require('sequelize');
const {sequelize} = require('../util/db');

class StreamUser extends Model {}

StreamUser.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    default: true
  },

  write: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    default: false
  },

  deleteOwn: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    default: false
  },

  deleteAll: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    default: false
  },

  admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    default: false
  },

}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'streamUser'
});

module.exports = StreamUser;
