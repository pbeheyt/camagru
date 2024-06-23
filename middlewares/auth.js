const User = require('../models/User');
const path = require('path');

exports.validateAccount = async (req, res, next) => {
    const token = req.url.split('/')[2]; // Extract token from URL
    console.log(token);
    try {
        const user = await User.findOne({ where: { confirmationToken: token } });

        if (!user) {
            res.statusCode = 302;
            res.setHeader('Location', '/login?error=' + encodeURIComponent('User not found'));
            res.end();
            return;
        }

        if (Date.now() > user.tokenExpiration) {
            res.statusCode = 302;
            res.setHeader('Location', '/login?error=' + encodeURIComponent('Token has expired'));
            res.end();
            return;
        }

        user.isConfirmed = true;
        user.confirmationToken = null;
        user.tokenExpiration = null;
        await user.save();

        next();
    } catch (error) {
        console.error('Error confirming user:', error);
        res.statusCode = 500;
        res.setHeader('Location', '/login?error=' + encodeURIComponent('Internal Server Error'));
        res.end();
    }
};

exports.validateResetToken = async (req, res, next) => {
  const token = req.url.split('/')[2]; // Extract token from URL

  try {
      const user = await User.findOne({ where: { passwordResetToken: token } });

      if (!user) {
          res.statusCode = 302;
          res.setHeader('Location', '/login?error=' + encodeURIComponent('Invalid token'));
          res.end();
          return;
      }

      const tokenExpiration = user.getDataValue('passwordResetTokenExpiration');
      if (Date.now() > tokenExpiration) {
          res.statusCode = 302;
          res.setHeader('Location', '/login?error=' + encodeURIComponent('Token has expired'));
          res.end();
          return;
      }

      next();
  } catch (error) {
      console.error('Error validating reset token:', error);
      res.statusCode = 500;
      res.setHeader('Location', '/login?error=' + encodeURIComponent('Internal Server Error'));
      res.end();
  }
};

exports.authenticateUser = (req, res, next) => {
  if (req.session.userId) {
      next();
  } else {
      res.statusCode = 401;
      res.sendFile(path.join(__dirname, '../views/main', 'unauthorized.html'));
  }
};

exports.isAuthenticated = (req, res, next) => {
  res.locals = res.locals || {}; // Ensure res.locals is initialized
  console.log('req session', req.session, req.session.userId);
  res.locals.isAuthenticated = req.session && req.session.userId ? true : false;
  next();
};

