const {DataTypes, Model} = require('sequelize');
const {sequelize} = require('../util/db');

class Slice extends Model {}

Slice.init({
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
    validate: {
      len: [0, 512]
    }
  },

  imageData: {
    type: DataTypes.BLOB('long'),
    allowNull: true
  },

  imageName: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  imageType: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  isPublic: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },

  isMilestone: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },

}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'slices'
});

module.exports = Slice;
