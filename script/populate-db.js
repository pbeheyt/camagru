const { client, connectToDatabase } = require('../database/connect');
const bcrypt = require('bcrypt');

const NUMBER_OF_USERS = 10;
const NUMBER_OF_IMAGES = 50;
const NUMBER_OF_COMMENTS = 100;
const NUMBER_OF_LIKES = 100;

async function createDummyData() {
  try {
    await connectToDatabase(); // Ensure connection

    // Create Users
    const users = [];
    const passwordHash = await bcrypt.hash('$oleil123', 10);
    for (let i = 0; i < NUMBER_OF_USERS; i++) {
      const result = await client.query(
        `INSERT INTO users (email, username, password, "isConfirmed") VALUES ($1, $2, $3, $4) RETURNING *`,
        [`user${i}@example.com`, `user${i}`, passwordHash, true]
      );
      users.push(result.rows[0]);
    }

    // Create Images
    const images = [];
    for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const result = await client.query(
        `INSERT INTO images (url, description, "userId") VALUES ($1, $2, $3) RETURNING *`,
        ['uploads/test.png', `Description for image ${i}`, user.id]
      );
      images.push(result.rows[0]);
    }

    // Create Comments
    for (let i = 0; i < NUMBER_OF_COMMENTS; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const image = images[Math.floor(Math.random() * images.length)];
      await client.query(
        `INSERT INTO comments ("userId", "imageId", text) VALUES ($1, $2, $3)`,
        [user.id, image.id, `Comment ${i} on image ${image.id} by ${user.username}`]
      );
    }

    // Create Likes
    for (let i = 0; i < NUMBER_OF_LIKES; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const image = images[Math.floor(Math.random() * images.length)];
      await client.query(
        `INSERT INTO likes ("userId", "imageId") VALUES ($1, $2)`,
        [user.id, image.id]
      );

      // Update image likes count
      await client.query(
        `UPDATE images SET likes = likes + 1 WHERE id = $1`,
        [image.id]
      );
    }

    console.log('Dummy data created successfully!');
  } catch (error) {
    console.error('Error creating dummy data:', error);
  } finally {
    try {
      await client.end(); // Close the database connection
      console.log('Database connection closed.');
    } catch (closeError) {
      console.error('Error closing the database connection:', closeError);
    }
  }
}

createDummyData();