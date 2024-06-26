const { client } = require('../database/connect');

const createLikeTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS likes (
      id SERIAL PRIMARY KEY,
      "userId" INTEGER NOT NULL REFERENCES users(id),
      "imageId" INTEGER NOT NULL REFERENCES images(id),
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `;
  await client.query(query);
};

module.exports = {
  createLikeTable,
};
