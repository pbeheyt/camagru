const { Client } = require('pg');
const config = require('../config/config').development;

const client = new Client({
  user: config.username,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.port,
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
