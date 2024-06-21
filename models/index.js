// const { Sequelize } = require('sequelize');
// const sequelize = require('../database/init');
const User = require('./User');
const Image = require('./Image');
const Comment = require('./Comment');
const Like = require('./Like');

const models = {
	User,
	Image,
	Comment,
	Like
};

Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

// models.sequelize = sequelize;
// models.Sequelize = Sequelize;

module.exports = models;
