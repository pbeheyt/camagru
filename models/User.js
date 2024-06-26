const { client } = require('../database/connect');

const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(100) UNIQUE NOT NULL,
      username VARCHAR(50) NOT NULL,
      password VARCHAR(100) NOT NULL,
      "confirmationToken" VARCHAR(100),
      "confirmationTokenExpires" TIMESTAMP,
      "isConfirmed" BOOLEAN DEFAULT FALSE,
      "passwordResetToken" VARCHAR(100),
      "passwordResetExpires" TIMESTAMP,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `;
  await client.query(query);
};

module.exports = {
  createUserTable,
};
