const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/init');
const User = require('./User');
const Image = require('./Image');

class Comment extends Sequelize.Model {}

Comment.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  imageId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
    createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Comment',
  tableName: 'comments'
});

Comment.belongsTo(User, { foreignKey: 'user_id' });
Comment.belongsTo(Image, { foreignKey: 'image_id' });

module.exports = Comment;
