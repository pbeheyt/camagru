const { escapeHtml, authenticateUser } = require('../../utils');
const path = require('path');

exports.renderLoginPage = (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'views', 'login.html'));
};

exports.handleLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.redirect('/login?error=' + encodeURIComponent('Username and password are required.'));
  }

  const sanitizedUsername = escapeHtml(username);
  const sanitizedPassword = escapeHtml(password);

  console.log('Username:', sanitizedUsername);
  console.log('Password:', sanitizedPassword);

  try {
    const user = await authenticateUser(sanitizedUsername, sanitizedPassword);
    if (!user) {
      return res.redirect('/login?error=' + encodeURIComponent('Invalid username or password.'));
    }
    if (!user.isConfirmed) {
      return res.redirect('/login?error=' + encodeURIComponent('Account not confirmed. Please check your email.'));
    }
    res.redirect('/home');
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).redirect('/login?error=' + encodeURIComponent('Internal Server Error'));
  }
};
