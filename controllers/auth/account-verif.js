const User = require('../../models/User');

exports.handleConfirmation = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ where: { confirmationToken: token } });

    if (!user) {
      return res.status(404).send('User not found');
    }

    const tokenExpiration = user.getDataValue('tokenExpiration');
    if (Date.now() > tokenExpiration) {
      return res.status(400).send('Token has expired');
    }

    user.isConfirmed = true;
    user.confirmationToken = null;
    user.tokenExpiration = null;
    await user.save();

	res.status(200).render('login', { success: 'Your account has been successfully verified. Please log in.' });

  } catch (error) {
    console.error('Error confirming user:', error);
    res.status(500).send('Internal Server Error');
  }
};