const User = require('../../models/User');

exports.handleConfirmation = async (req, res) => {
	const { token } = req.params;
  
	try {
	  const user = await User.findOne({ where: { confirmationToken: token } });
  
	  if (!user) {
		return res.redirect('/login?error=' + encodeURIComponent('User not found'));
	  }
  
	  const tokenExpiration = user.getDataValue('tokenExpiration');
	  if (Date.now() > tokenExpiration) {
		return res.redirect('/login?error=' + encodeURIComponent('Token has expired'));
	  }
  
	  user.isConfirmed = true;
	  user.confirmationToken = null;
	  user.tokenExpiration = null;
	  await user.save();
  
	  return res.redirect('/login?success=' + encodeURIComponent('Your account has been successfully verified. Please log in.'));
	} catch (error) {
	  console.error('Error confirming user:', error);
	  return res.redirect('/login?error=' + encodeURIComponent('Internal Server Error'));
	}
  };
  