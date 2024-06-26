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

// Object.values(models).forEach(model => {
//   if (model.associate) {
//     model.associate(models);
//   }
// });

module.exports = models;