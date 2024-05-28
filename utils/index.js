const authenticateUser = require('./auth');
const { isValidEmail, isValidPassword } = require('./validation');
const { generateToken, getTokenExpiration } = require('./token');
const { sendConfirmationEmail, sendPasswordResetEmail } = require('./mailer');
const escapeHtml = require('./security');

module.exports = {
  authenticateUser,
  isValidEmail,
  isValidPassword,
  generateToken,
  getTokenExpiration,
  sendConfirmationEmail,
  sendPasswordResetEmail,
  escapeHtml,
};
