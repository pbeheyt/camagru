const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user');
const Image = require('./image');

class Comment extends Sequelize.Model {}

Comment.init({
  text: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Comment',
  tableName: 'comments'
});

Comment.belongsTo(User, { foreignKey: 'user_id' });
Comment.belongsTo(Image, { foreignKey: 'image_id' });

module.exports = Comment;
