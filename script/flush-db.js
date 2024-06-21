const sequelize = require('../database/init');
const User = require('../models/User');
const Image = require('../models/Image');
const Comment = require('../models/Comment');
const Like = require('../models/Like');

async function flush() {
	// Iterate over the models and delete all the records from each table
	for (const model of [Like, Comment, Image, User]) {
	  await model.destroy({
		where: {}
	  });
	}
  
	console.log('Database flushed successfully!');
  }
  
flush()
	.catch((err) => {
	  console.error('Error flushing database:', err);
	  process.exitCode = 1;
});
