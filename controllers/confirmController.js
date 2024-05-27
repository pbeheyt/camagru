const User = require('../models/User');

exports.handleConfirmation = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ where: { confirmationToken: token } });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check if token is expired
    const tokenExpiration = user.getDataValue('tokenExpiration');
    if (Date.now() > tokenExpiration) {
      return res.status(400).send('Token has expired');
    }

    // Mark user as confirmed and remove confirmation token
    user.isConfirmed = true;
    user.confirmationToken = null;
    user.tokenExpiration = null;
    await user.save();

    res.redirect('/login');
  } catch (error) {
    console.error('Error confirming user:', error);
    res.status(500).send('Internal Server Error');
  }
};