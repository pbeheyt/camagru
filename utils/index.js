const authenticateUser = require('./authenticateUser');
const escapeHtml = require('./escapeHtml');
const isValidEmail = require('./isValidEmail');
const isValidPassword = require('./isValidPassword');
const generateToken = require('./generateToken');
const getTokenExpiration = require('./getTokenExpiration');
const sendConfirmationEmail = require('./sendConfirmationEmail');

module.exports = {
  authenticateUser,
  escapeHtml,
  generateToken,
  getTokenExpiration,
  isValidEmail,
  isValidPassword,
  sendConfirmationEmail,
};
