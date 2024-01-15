const {DataTypes, Model} = require('sequelize');
const {sequelize} = require('../util/db');

class Entry extends Model {}

Entry.init({
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
  modelName: 'entry'
});

module.exports = Entry;
