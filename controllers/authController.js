// authController.js

const { escapeHtml, isValidEmail, isValidPassword, authenticateUser } = require('../utils');
const { generateToken , getTokenExpiration, sendConfirmationEmail } = require('../utils');

const User = require('../models/User');
const bcrypt = require('bcrypt');

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

exports.renderRegisterPage = (req, res) => {
    res.render('register');
};

exports.handleRegister = async (req, res) => {
	const { email, username, password } = req.body;
  
	if (!email || !username || !password) {
	  return res.status(400).render('register', { error: 'Email, username, and password are required.' });
	}
  
	if (!isValidEmail(email)) {
	  return res.status(400).render('register', { error: 'Invalid email format.' });
	}
  
	if (!isValidPassword(password)) {
	  return res.status(400).render('register', { error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.' });
	}
  
	const sanitizedEmail = escapeHtml(email);
	const sanitizedUsername = escapeHtml(username);
	const sanitizedPassword = escapeHtml(password);
  
	console.log('Email:', sanitizedEmail);
	console.log('Username:', sanitizedUsername);
	console.log('Password:', sanitizedPassword);
  
	try {
	  const existingUser = await User.findOne({ where: { email: sanitizedEmail } });
	  if (existingUser) {
		return res.status(409).render('register', { error: 'Email address is already in use.' });
	  }
  
	  const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);
	  const confirmationToken = generateToken();

	  
	  const newUser = await User.create({
		  email: sanitizedEmail,
		  username: sanitizedUsername,
		  password: hashedPassword,
		  confirmationToken,
		  isConfirmed: false,
		});

	  // Send confirmation email
	  await sendConfirmationEmail(newUser, req);

	  console.log('New user created:', newUser);
  
  
	  res.redirect('/login');
	} catch (error) {
	  console.error('Error creating user:', error);
	  res.status(500).send('Internal Server Error');
	}
};
