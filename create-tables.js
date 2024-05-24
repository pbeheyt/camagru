const sequelize = require('./database');
const User = require('./models/user');
const Image = require('./models/image');
const Comment = require('./models/comment');
const Like = require('./models/like');

sequelize.sync({ force: true })
  .then(() => {
    console.log('Tables created');
  })
  .catch((err) => {
    console.error(err);
  });
