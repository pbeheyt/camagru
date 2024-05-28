const User = require('../models/User');
const { generateToken, getTokenExpiration, sendPasswordResetEmail, isValidPassword } = require('../utils');
const bcrypt = require('bcrypt');

exports.renderForgotPasswordPage = (req, res) => {
	res.render('forgot-password');
  };

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(404).render('forgot-password', { error: 'User not found' });
  }

  const token = generateToken();
  console.log(`Generated token: ${token}`);
  user.passwordResetToken = token;
  user.passwordResetExpires = getTokenExpiration();
  await user.save();
  console.log(`Saved user with token: ${user.passwordResetToken}`);

  await sendPasswordResetEmail(user, req);

  res.status(200).render('forgot-password', { success: 'Password reset request sent' });
};

exports.handleResetTokenCheck = async (req, res) => {
	const { token } = req.params;
  
	try {
	  const user = await User.findOne({ where: { passwordResetToken: token } });
  
	  if (!user) {
		return res.status(404).send('User not found');
	  }
  
	  const tokenExpiration = user.getDataValue('passwordResetTokenExpiration');
	  if (Date.now() > tokenExpiration) {
		return res.status(400).send('Token has expired');
	  }
  
	  res.render('reset-password', { token });
	} catch (error) {
	  console.error('Error checking reset token:', error);
	  res.status(500).send('Internal Server Error');
	}
};

exports.resetPassword = async (req, res) => {
	const { token, password, 'confirm-password': confirmPassword } = req.body;
	
	if (!isValidPassword(password)) {
		return res.status(400).render('reset-password', { token, error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.' });
	}

	if (password !== confirmPassword) {
	return res.status(400).render('reset-password', { token, error: 'Passwords do not match' });
	}
  
	try {
	  const user = await User.findOne({ where: { passwordResetToken: token } });
  
	  if (!user) {
		return res.status(404).render('reset-password', { token, error: 'User not found' });
	  }
  
	  const tokenExpiration = user.getDataValue('passwordResetTokenExpiration');
	  if (Date.now() > tokenExpiration) {
		return res.status(400).render('reset-password', { token, error: 'Token has expired' });
	  }
  
	  const hashedPassword = await bcrypt.hash(password, 10);
  
	  user.password = hashedPassword;
	  user.passwordResetToken = null;
	  user.passwordResetTokenExpiration = null;
	  await user.save();
  
	  res.status(200).render('login', { success: 'Your password has been successfully reset. Please log in with your new password.' });
	} catch (error) {
	  console.error('Error resetting password:', error);
	  res.status(500).send('Internal Server Error');
	}
  };