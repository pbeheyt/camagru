const { Sequelize } = require('sequelize');

// Load the environment variables from the .env file
require('dotenv').config();

// Create a new Sequelize instance and configure it to connect to the database
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Export the Sequelize instance
module.exports = sequelize;
