const sequelize = require('../database/init');
const User = require('../models/User');
const Image = require('../models/Image');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const bcrypt = require('bcrypt');

const populateDatabase = async () => {
  try {
    await sequelize.sync({force : 'true'});

    const passwordHash = await bcrypt.hash('$oleil123', 10);
    const users = [];

    for (let i = 1; i <= 5; i++) {
      const user = await User.create({
        email: `user${i}@example.com`,
        username: `user${i}`,
        password: passwordHash,
		isConfirmed: true
      });

      users.push(user);
    }

    console.log('Database populated with sample data!');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    sequelize.close();
  }
};

populateDatabase();
