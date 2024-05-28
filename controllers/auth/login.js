const { escapeHtml, authenticateUser } = require('../../utils');

exports.renderLoginPage = (req, res) => {
    res.render('login');
};

exports.handleLogin = async (req, res) => {
	const { username, password } = req.body;
  
	if (!username || !password) {
	  return res.status(400).render('login', { error: 'Username and password are required.' });
	}
  
	const sanitizedUsername = escapeHtml(username);
	const sanitizedPassword = escapeHtml(password);
  
	console.log('Username:', sanitizedUsername);
	console.log('Password:', sanitizedPassword);
  
	try {
	  const user = await authenticateUser(sanitizedUsername, sanitizedPassword);
	  if (!user) {
		return res.status(401).render('login', { error: 'Invalid username or password.' });
	  }
	  if (!user.isConfirmed) {
		return res.status(401).render('login', { error: 'Account not confirmed. Please check your email.' });
	  }
	  res.redirect('/home');
	} catch (error) {
	  console.error('Error authenticating user:', error);
	  res.status(500).send('Internal Server Error');
	}
};