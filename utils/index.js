const authenticateUser = require('./auth');
const { isValidEmail, isValidPassword, isValidBase64} = require('./validation');
const { generateToken, getTokenExpiration } = require('./token');
const { sendConfirmationEmail, sendPasswordResetEmail } = require('./mailer');
const { sendFile, sendJson } = require('./responseMethods');
const escapeHtml = require('./security');
const generateUUID = require('./uuid');

module.exports = {
  authenticateUser,
  isValidEmail,
  isValidPassword,
  isValidBase64,
  generateToken,
  getTokenExpiration,
  sendConfirmationEmail,
  sendPasswordResetEmail,
  escapeHtml,
  sendFile,
  sendJson,
  generateUUID
};
