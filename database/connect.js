const { Client } = require('pg');
const path = require('path');
const loadEnv = require('../utils/loadEnv');
loadEnv(path.join(__dirname, '..', '.env'));

const client = new Client({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const connectToDatabase = async () => {
  try {
    if (!client._connected) { // Ensure the client is not already connected
      await client.connect();
      client._connected = true;
      // console.log('Database connection has been established successfully.');
    }
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1); // Exit the process with a failure code
  }
};

module.exports = {
  client,
  connectToDatabase,
};
