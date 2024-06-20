const sequelize = require('../database/init');
const User = require('../models/User');
const Image = require('../models/Image');
const Comment = require('../models/Comment');
const Like = require('../models/Like');

const populateDatabase = async () => {
  try {
    await sequelize.sync({ force: true });

    const user = await User.create({
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123'
    });

    const image = await Image.create({
      url: 'https://media.licdn.com/dms/image/C4E03AQHHo7C1dSqlsg/profile-displayphoto-shrink_200_200/0/1655832769574?e=2147483647&v=beta&t=iHNv8YH9XSICx8Al__fz3Lkvff2yf5uIokfeXhjoCZI',
      description: 'A sample image',
      userId: user.id
    });

    await Comment.create({
      userId: user.id,
      imageId: image.id,
      text: 'Nice image!'
    });

    await Like.create({
      userId: user.id,
      imageId: image.id
    });

    console.log('Database populated with sample data!');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    sequelize.close();
  }
};

populateDatabase();
