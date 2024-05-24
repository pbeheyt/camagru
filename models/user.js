const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

class User extends Sequelize.Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      min: 8,
      max: 100
    }
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users'
});

module.exports = User;
