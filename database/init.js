const { createUserTable } = require('../models/User');
const { createImageTable } = require('../models/Image');
const { createCommentTable } = require('../models/Comment');
const { createLikeTable } = require('../models/Like');

const initializeDatabase = async () => {
  try {
    await createUserTable();
    await createImageTable();
    await createCommentTable();
    await createLikeTable();
    console.log('Database & tables created!');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

module.exports = {
  initializeDatabase,
};
