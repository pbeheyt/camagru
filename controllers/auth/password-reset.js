const bcrypt = require('bcrypt');
const User = require('../../models/User');
const { isValidPassword } = require('../../utils');
const path = require('path');

exports.handleResetTokenCheck = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ where: { passwordResetToken: token } });

    if (!user) {
      return res.status(404).redirect('/password-reset?error=' + encodeURIComponent('User not found'));
    }

    const tokenExpiration = user.getDataValue('passwordResetTokenExpiration');
    if (Date.now() > tokenExpiration) {
      return res.status(400).redirect('/password-reset?error=' + encodeURIComponent('Token has expired'));
    }

    res.sendFile(path.join(__dirname, '..', '..', 'views', 'password-reset.html'));
  } catch (error) {
    console.error('Error checking reset token:', error);
    res.status(500).redirect('/password-reset?error=' + encodeURIComponent('Internal Server Error'));
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password, 'confirm-password': confirmPassword } = req.body;

  if (!isValidPassword(password)) {
    return res.redirect(`/password-reset?token=${encodeURIComponent(token)}&error=${encodeURIComponent('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.')}`);
  }

  if (password !== confirmPassword) {
    return res.redirect(`/password-reset?token=${encodeURIComponent(token)}&error=${encodeURIComponent('Passwords do not match')}`);
  }

  try {
    const user = await User.findOne({ where: { passwordResetToken: token } });

    if (!user) {
      return res.redirect(`/password-reset?token=${encodeURIComponent(token)}&error=${encodeURIComponent('User not found')}`);
    }

    const tokenExpiration = user.getDataValue('passwordResetTokenExpiration');
    if (Date.now() > tokenExpiration) {
      return res.redirect(`/password-reset?token=${encodeURIComponent(token)}&error=${encodeURIComponent('Token has expired')}`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetTokenExpiration = null;
    await user.save();

    res.redirect('/login?success=' + encodeURIComponent('Your password has been successfully reset. Please log in with your new password.'));
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).redirect('/password-reset?error=' + encodeURIComponent('Internal Server Error'));
  }
};
