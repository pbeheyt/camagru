const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/init');
const User = require('./User');
const Image = require('./Image');

class Like extends Sequelize.Model {}

Like.init({
  userId: {
	type: DataTypes.INTEGER,
	allowNull: false
  },
	imageId: {
	type: DataTypes.INTEGER,
	allowNull: false
  }
}, {
  sequelize,
  modelName: 'Like',
  tableName: 'likes'
});

Like.belongsTo(User, { foreignKey: 'user_id' });
Like.belongsTo(Image, { foreignKey: 'image_id' });

module.exports = Like;
