const { client } = require('../database/connect');

const createImageTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS images (
      id SERIAL PRIMARY KEY,
      url VARCHAR(255) NOT NULL,
      description TEXT,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      likes INTEGER DEFAULT 0,
      "userId" INTEGER NOT NULL REFERENCES users(id)
    );
  `;
  await client.query(query);
};

module.exports = {
  createImageTable,
};
