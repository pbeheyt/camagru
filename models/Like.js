const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');
const Image = require('./Image');

class Like extends Sequelize.Model {}

Like.init({}, {
  sequelize,
  modelName: 'Like',
  tableName: 'likes'
});

Like.belongsTo(User, { foreignKey: 'user_id' });
Like.belongsTo(Image, { foreignKey: 'image_id' });

module.exports = Like;
