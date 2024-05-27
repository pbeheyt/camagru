const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');

class Image extends Sequelize.Model {}

Image.init({
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'Image',
  tableName: 'images'
});

Image.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Image;
