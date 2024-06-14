const bcrypt = require('bcrypt');
const User = require('../../models/User');

exports.updateUser = async (req, res) => {
  const { email, username, password, 'confirm-password': confirmPassword } = req.body;

  try {
    // const user = req.user;

    if (email) user.email = email;
    if (username) user.username = username;
    if (password) {
      if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.status(200).json({ success: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
