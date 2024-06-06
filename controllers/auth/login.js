const { escapeHtml, authenticateUser } = require('../../utils');
const path = require('path');

exports.renderLoginPage = (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'views', 'login.html'));
};

exports.handleLogin = async (req, res) => {
	const { username, password } = req.body;
  
	if (!username || !password) {
	  return res.status(400).json({ error: 'Username and password are required.' });
	}
  
	const sanitizedUsername = escapeHtml(username);
	const sanitizedPassword = escapeHtml(password);
  
	console.log('Username:', sanitizedUsername);
	console.log('Password:', sanitizedPassword);
  
	try {
	  const user = await authenticateUser(sanitizedUsername, sanitizedPassword);
	  if (!user) {
		return res.status(401).json({ error: 'Invalid username or password.' });
	  }
	  if (!user.isConfirmed) {
		return res.status(401).json({ error: 'Account not confirmed. Please check your email.' });
	  }
	  res.status(200).json({ success: 'Login successful.' });
	} catch (error) {
	  console.error('Error authenticating user:', error);
	  res.status(500).json({ error: 'Internal Server Error' });
	}
  };
  
