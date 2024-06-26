const { client } = require('../database/connect');

const createCommentTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      "userId" INTEGER NOT NULL REFERENCES users(id),
      "imageId" INTEGER NOT NULL REFERENCES images(id),
      text TEXT NOT NULL,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `;
  await client.query(query);
};

module.exports = {
  createCommentTable,
};
