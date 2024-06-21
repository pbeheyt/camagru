const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/init');
const User = require('./User');
const Image = require('./Image');

class Like extends Model {
	static associate(models) {
	  this.belongsTo(models.User, { foreignKey: 'userId' });
	  this.belongsTo(models.Image, { foreignKey: 'imageId' });
	}
  }

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

module.exports = Like;
