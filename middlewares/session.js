const session = require('express-session');

exports.sessionMiddleware = session({
  secret: 'vedson',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
});
