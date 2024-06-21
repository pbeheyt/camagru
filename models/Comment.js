const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/init');
const User = require('./User');
const Image = require('./Image');

class Comment extends Model {
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId' });
    this.belongsTo(models.Image, { foreignKey: 'imageId' });
  }
}

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

module.exports = Comment;
