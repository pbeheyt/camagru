const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/init');
const User = require('./User');

class Image extends Sequelize.Model {}

Image.init({
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Image',
  tableName: 'images'
});

Image.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Image;
