const bcrypt = require('bcrypt');
const { isValidPassword } = require('../../utils');
const User = require('../../models/User');

exports.resetPassword = async (req, res) => {
  const { password, 'confirm-password': confirmPassword } = req.body;
  const { token } = req.params;

  if (!isValidPassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    const user = await User.findOne({ where: { passwordResetToken: token } });

    if (!user) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetTokenExpiration = null;
    await user.save();

    res.json({ success: 'Your password has been successfully reset.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
