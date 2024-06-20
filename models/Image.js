const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/init');
const User = require('./User');

class Image extends Model {
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId' });
    this.hasMany(models.Comment, { foreignKey: 'imageId' });
    this.hasMany(models.Like, { foreignKey: 'imageId' });
  }
}

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

module.exports = Image;
