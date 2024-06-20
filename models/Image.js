const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/init');

class User extends Model {}

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
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8, 100]
    }
  },
  confirmationToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isConfirmed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  passwordResetToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  passwordResetExpires: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users'
});

module.exports = User;
