const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/init');
const User = require('./User');
const Image = require('./Image');

class Comment extends Model {}

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

Comment.belongsTo(User, { foreignKey: 'userId' });
Comment.belongsTo(Image, { foreignKey: 'imageId' });
User.hasMany(Comment, { foreignKey: 'userId' });
Image.hasMany(Comment, { foreignKey: 'imageId' });

module.exports = Comment;
