const { User, Image, Comment, Like } = require('../models');
const sequelize = require('../database/init'); // Adjust the path to your database initialization file
const bcrypt = require('bcrypt'); // Adjust the path to your database initialization file

const NUMBER_OF_USERS = 10;
const NUMBER_OF_IMAGES = 50;
const NUMBER_OF_COMMENTS = 100;
const NUMBER_OF_LIKES = 100;

async function createDummyData() {
  try {
    await sequelize.sync({ force: true }); // This will drop the existing tables and create new ones

    // Create Users
    const users = [];
	const passwordHash = await bcrypt.hash('$oleil123', 10);
    for (let i = 0; i < NUMBER_OF_USERS; i++) {
      const user = await User.create({
        email: `user${i}@example.com`,
        username: `user${i}`,
        password: passwordHash,
        isConfirmed: true
      });
      users.push(user);
    }

    // Create Images
    const images = [];
    for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const image = await Image.create({
        url: 'uploads/test.png',
        description: `Description for image ${i}`,
        userId: user.id
      });
      images.push(image);
    }

    // Create Comments
    for (let i = 0; i < NUMBER_OF_COMMENTS; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const image = images[Math.floor(Math.random() * images.length)];
      await Comment.create({
        userId: user.id,
        imageId: image.id,
        text: `Comment ${i} on image ${image.id} by user ${user.id}`
      });
    }

    // Create Likes
    for (let i = 0; i < NUMBER_OF_LIKES; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const image = images[Math.floor(Math.random() * images.length)];
      await Like.create({
        userId: user.id,
        imageId: image.id
      });

      // Update image likes count
      image.likes += 1;
      await image.save();
    }

    console.log('Dummy data created successfully!');
  } catch (error) {
    console.error('Error creating dummy data:', error);
  } finally {
    await sequelize.close();
  }
}

createDummyData();
