const sequelize = require('./database');
const User = require('./models/User');
const Image = require('./models/Image');
const Comment = require('./models/Comment');
const Like = require('./models/Like');

sequelize.sync({ force: true })
  .then(() => {
    console.log('Tables created');
  })
  .catch((err) => {
    console.error(err);
  });
