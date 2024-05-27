const User = require('../models/User');
const { generateToken, getTokenExpiration, sendPasswordResetEmail } = require('../utils');

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