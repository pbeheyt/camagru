const { client } = require('../database/connect');
const path = require('path');

exports.validateAccount = async (req, res, next) => {
  const token = req.url.split('/')[2]; // Extract token from URL

  try {
      const query = 'SELECT * FROM users WHERE "confirmationToken" = $1';
      const result = await client.query(query, [token]);
      const user = result.rows[0];

      if (!user) {
          return res.status(302).redirect('/login?error=' + encodeURIComponent('User not found'));
      }
      if (Date.now() > new Date(user.confirmationTokenExpires)) {
          return res.status(302).redirect('/login?error=' + encodeURIComponent('Token has expired'));
      }

      const updateQuery = `
          UPDATE users
          SET "isConfirmed" = true, "confirmationToken" = null, "confirmationTokenExpires" = null
          WHERE id = $1
      `;
      await client.query(updateQuery, [user.id]);

      next();
  } catch (error) {
      console.error('Error confirming user:', error);
      return res.status(500).redirect('/login?error=' + encodeURIComponent('Internal Server Error'));
  }
};

exports.validateResetToken = async (req, res, next) => {
  const token = req.url.split('/')[2]; // Extract token from URL

  try {
      const query = 'SELECT * FROM users WHERE "passwordResetToken" = $1';
      const result = await client.query(query, [token]);
      const user = result.rows[0];

      if (!user) {
          return res.status(302).redirect('/login?error=' + encodeURIComponent('Invalid token'));
      }
      
      if (Date.now() > new Date(user.passwordResetExpires)) {
          return res.status(302).redirect('/login?error=' + encodeURIComponent('Token has expired'));
      }

      next();
  } catch (error) {
      console.error('Error validating reset token:', error);
      return res.status(500).redirect('/login?error=' + encodeURIComponent('Internal Server Error'));
  }
};

exports.authenticateUser = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    const contentType = req.headers['content-type'];

    if (contentType && (contentType.indexOf('application/json') !== -1 || contentType.indexOf('application/x-www-form-urlencoded') !== -1)) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
    } else {
      res.status(401).sendFile(path.join(__dirname, '../views/main', 'unauthorized.html'));
    }
  }
};

exports.isAuthenticated = (req, res, next) => {
  res.locals = res.locals || {}; // Ensure res.locals is initialized
  res.locals.isAuthenticated = req.session && req.session.userId ? true : false;
  next();
};
