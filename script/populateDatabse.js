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

    for (const user of users) {
      const image = await Image.create({
        url: 'https://media.licdn.com/dms/image/C4E03AQHHo7C1dSqlsg/profile-displayphoto-shrink_200_200/0/1655832769574?e=2147483647&v=beta&t=iHNv8YH9XSICx8Al__fz3Lkvff2yf5uIokfeXhjoCZI',
        description: `A sample image by ${user.username}`,
        userId: user.id
      });

      await Comment.create({
        userId: user.id,
        imageId: image.id,
        text: `Nice image by ${user.username}!`
      });

      await Like.create({
        userId: user.id,
        imageId: image.id
      });
    }

    console.log('Database populated with sample data!');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    sequelize.close();
  }
};

populateDatabase();
