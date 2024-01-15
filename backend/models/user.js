const {DataTypes, Model} = require('sequelize');
const {sequelize} = require('../util/db');

class User extends Model {}

User.init({
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

  firstName: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  lastName: {
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

  emailConfirmed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },

  passwordHash: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  isDisabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  storageLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'user'
});

module.exports = User;
