const bcrypt = require('bcrypt');
const { client } = require('../database/connect');

async function authenticateUser(username, password) {
  const query = 'SELECT * FROM users WHERE username = $1';
  const result = await client.query(query, [username]);
  const user = result.rows[0];

  if (user && await bcrypt.compare(password, user.password)) {
    return user;
  } else {
    return null;
  }
};

module.exports = authenticateUser;
