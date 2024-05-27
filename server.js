const express = require('express');
const app = express();
const path = require('path');
const sequelize = require('./database');
const router = require('./router');

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the directory for views
app.set('views', path.join(__dirname, 'views'));

// Set up static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies for form data
app.use(express.urlencoded({ extended: true }));

// Mount the routes on a specific route
app.use('/', router);

// Initialize the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    // Start the server only after the database connection is established
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
