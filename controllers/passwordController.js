const User = require('../models/User');
const { generateToken, getTokenExpiration, sendPasswordResetEmail } = require('../utils');
const bcrypt = require('bcrypt');

exports.renderForgotPasswordPage = (req, res) => {
	res.render('forgot-password');
  };

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  // Find the user by email
  const user = await User.findOne({ where: { email } });

  if (!user) {
    // If the user doesn't exist, display an error message
    return res.status(404).render('forgot-password', { error: 'User not found' });
  }

  // Generate a password reset token
  const token = generateToken();
  console.log(`Generated token: ${token}`);
  user.passwordResetToken = token;
  user.passwordResetExpires = getTokenExpiration();
  await user.save();
  console.log(`Saved user with token: ${user.passwordResetToken}`);

  await sendPasswordResetEmail(user, req);

  // Display a success message
  res.status(200).render('forgot-password', { success: 'Password reset request sent' });
};

exports.handleResetTokenCheck = async (req, res) => {
	const { token } = req.params;
  
	console.log(token);
	try {
	  const user = await User.findOne({ where: { passwordResetToken: token } });
  
	  if (!user) {
		return res.status(404).send('User not found');
	  }
  
	  // Check if token is expired
	  const tokenExpiration = user.getDataValue('passwordResetTokenExpiration');
	  if (Date.now() > tokenExpiration) {
		return res.status(400).send('Token has expired');
	  }
  
	  // Render the password reset form
	  res.render('reset-password', { token });
	} catch (error) {
	  console.error('Error checking reset token:', error);
	  res.status(500).send('Internal Server Error');
	}
};

exports.resetPassword = async (req, res) => {
	const { token, password, 'confirm-password': confirmPassword } = req.body;
  
	console.log(token, password, confirmPassword);
	if (password !== confirmPassword) {
	  // If the passwords don't match, display an error message
	  return res.status(400).render('reset-password', { token, error: 'Passwords do not match' });
	}
  
	try {
	  const user = await User.findOne({ where: { passwordResetToken: token } });
  
	  if (!user) {
		// If the user doesn't exist, display an error message
		return res.status(404).render('reset-password', { token, error: 'User not found' });
	  }
  
	  // Check if token is expired
	  const tokenExpiration = user.getDataValue('passwordResetTokenExpiration');
	  if (Date.now() > tokenExpiration) {
		// If the token is expired, display an error message
		return res.status(400).render('reset-password', { token, error: 'Token has expired' });
	  }
  
	  // Hash the new password
	  const hashedPassword = await bcrypt.hash(password, 10);
  
	  // Update the user's password
	  user.password = hashedPassword;
	  user.passwordResetToken = null;
	  user.passwordResetTokenExpiration = null;
	  await user.save();
  
	  // Display a success message
	  res.status(200).render('login', { success: 'Your password has been successfully reset. Please log in with your new password.' });
	} catch (error) {
	  console.error('Error resetting password:', error);
	  res.status(500).send('Internal Server Error');
	}
  };