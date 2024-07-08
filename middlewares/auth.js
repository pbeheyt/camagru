const { client } = require('../database/connect');
const path = require('path');

exports.validateAccount = async (req, res, next) => {
    const token = req.url.split('/')[2]; // Extract token from URL
  
    try {
      const query = 'SELECT * FROM users WHERE "confirmationToken" = $1';
      const result = await client.query(query, [token]);
      const user = result.rows[0];
  
      if (!user) {
        res.statusCode = 302;
        res.setHeader('Location', '/login?error=' + encodeURIComponent('User not found'));
        res.end();
        return;
      }
      if (Date.now() > new Date(user.confirmationTokenExpires)) {
        res.statusCode = 302;
        res.setHeader('Location', '/login?error=' + encodeURIComponent('Token has expired'));
        res.end();
        return;
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
      res.statusCode = 500;
      res.setHeader('Location', '/login?error=' + encodeURIComponent('Internal Server Error'));
      res.end();
    }
  };

exports.validateResetToken = async (req, res, next) => {
  const token = req.url.split('/')[2]; // Extract token from URL

  try {
    const query = 'SELECT * FROM users WHERE "passwordResetToken" = $1';
    const result = await client.query(query, [token]);
    const user = result.rows[0];

    if (!user) {
      res.statusCode = 302;
      res.setHeader('Location', '/login?error=' + encodeURIComponent('Invalid token'));
      res.end();
      return;
    }
    
    if (Date.now() > new Date(user.passwordResetExpires)) {
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
