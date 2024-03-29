const {DataTypes, Model} = require('sequelize');
const {sequelize} = require('../util/db');

class Strand extends Model {}

Strand.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  name: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'strands'
});

module.exports = Strand;
