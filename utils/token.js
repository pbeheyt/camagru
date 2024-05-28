const crypto = require('crypto');

function generateToken() {
	return crypto.randomBytes(20).toString('hex');
}

function getTokenExpiration() {
	return Date.now() + 3600000; // 1 hour from now
}

module.exports = {
  generateToken,
  getTokenExpiration,
};
