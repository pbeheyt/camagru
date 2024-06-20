const bcrypt = require('bcrypt');
const User = require('../../models/User');

exports.updateUserInfo = async (req, res) => {
  const { email, username, 'current-password': currentPassword } = req.body;

  try {
    const user = await User.findByPk(req.session.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid current password' });
    }

    if (email) user.email = email;
    if (username) user.username = username;

    await user.save();
    res.status(200).json({ success: 'Information updated successfully' });
  } catch (error) {
    console.error('Error updating user info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateUserPassword = async (req, res) => {
  const { 'old-password': oldPassword, 'new-password': newPassword, 'confirm-new-password': confirmNewPassword } = req.body;

  try {
    const user = await User.findByPk(req.session.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid old password' });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: 'New passwords do not match' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ success: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ success: true, user: { email: user.email, username: user.username } });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
