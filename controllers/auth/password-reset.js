const bcrypt = require('bcrypt');
const User = require('../../models/User');
const { isValidPassword } = require('../../utils');

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
  
	  res.render('password-reset', { token });
	} catch (error) {
	  console.error('Error checking reset token:', error);
	  res.status(500).send('Internal Server Error');
	}
};

exports.resetPassword = async (req, res) => {
	const { token, password, 'confirm-password': confirmPassword } = req.body;
	
	if (!isValidPassword(password)) {
		return res.status(400).render('password-reset', { token, error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.' });
	}

	if (password !== confirmPassword) {
	return res.status(400).render('password-reset', { token, error: 'Passwords do not match' });
	}
  
	try {
	  const user = await User.findOne({ where: { passwordResetToken: token } });
  
	  if (!user) {
		return res.status(404).render('password-reset', { token, error: 'User not found' });
	  }
  
	  const tokenExpiration = user.getDataValue('passwordResetTokenExpiration');
	  if (Date.now() > tokenExpiration) {
		return res.status(400).render('password-reset', { token, error: 'Token has expired' });
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