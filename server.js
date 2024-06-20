const express = require('express');
const path = require('path');
const sequelize = require('./database/init');
const router = require('./router');
const { sessionMiddleware } = require('./middlewares/session');
const { Image, Like, Comment, User } = require('./models');

const app = express();

// Set up static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Parse URL-encoded bodies for form data
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON
app.use(express.json());

// Use session middleware
app.use(sessionMiddleware);

// Middleware to make session data available to views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
})

// Mount the routes on a specific route
app.use('/', router);

// Initialize the database connection
const forceSync = process.env.FORCE_SYNC === 'true';

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
	// Initialize model associations
	User.associate({ Image, Comment, Like });
	Image.associate({ User, Comment, Like });
	Comment.associate({ User, Image });
	Like.associate({ User, Image });
    return sequelize.sync({ force: forceSync });
  })
  .then(() => {
    if (forceSync === 'true') {
      console.log('Database & tables created with force sync!');
    } else {
      console.log('Database synchronized without force sync.');
    }
    // Start the server only after the database is synchronized
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });