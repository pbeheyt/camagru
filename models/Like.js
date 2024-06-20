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

Like.belongsTo(User, { foreignKey: 'userId' });
Like.belongsTo(Image, { foreignKey: 'imageId' });
User.hasMany(Like, { foreignKey: 'userId' });
Image.hasMany(Like, { foreignKey: 'imageId' });

module.exports = Like;
