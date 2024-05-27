const bcrypt = require('bcrypt');
const User = require('../models/User');

async function authenticateUser(username, password) {
  const user = await User.findOne({ where: { username } });
  if (!user) {
    return false;
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  return isPasswordValid ? user : false;
}

module.exports = authenticateUser;
