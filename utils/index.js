const escapeHtml = require('./escapeHtml');
const isValidEmail = require('./isValidEmail');
const isValidPassword = require('./isValidPassword');
const authenticateUser = require('./auth');

module.exports = {
  escapeHtml,
  isValidEmail,
  isValidPassword,
  authenticateUser,
};
