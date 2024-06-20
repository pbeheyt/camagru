const User = require('../models/User');
const path = require('path');

exports.validateAccount = async (req, res, next) => {
	const { token } = req.params;
  
	try {
	  const user = await User.findOne({ where: { confirmationToken: token } });
  
	  if (!user) {
		return res.redirect('/login?error=' + encodeURIComponent('User not found'));
	  }
  
	  if (Date.now() > user.tokenExpiration) {
		return res.redirect('/login?error=' + encodeURIComponent('Token has expired'));
	  }
  
	  user.isConfirmed = true;
	  user.confirmationToken = null;
	  user.tokenExpiration = null;
	  await user.save();
  
	  next();
	} catch (error) {
	  console.error('Error confirming user:', error);
	  res.status(500).redirect('/login?error=' + encodeURIComponent('Internal Server Error'));
	}
};

exports.validateResetToken = async (req, res, next) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ where: { passwordResetToken: token } });

    if (!user) {
      return res.redirect('/login?error=' + encodeURIComponent('Invalid token'));
    }

    const tokenExpiration = user.getDataValue('passwordResetTokenExpiration');
    if (Date.now() > tokenExpiration) {
      return res.redirect('/login?error=' + encodeURIComponent('Token has expired'));
    }

    next();
  } catch (error) {
    console.error('Error validating reset token:', error);
    res.status(500).redirect('/login?error=' + encodeURIComponent('Internal Server Error'));
  }
};

exports.authenticateUser = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).sendFile(path.join(__dirname, '../views/main', 'unauthorized.html'));
    }
};

exports.isAuthenticated = (req, res, next) => {
	res.locals.isAuthenticated = req.session && req.session.userId ? true : false;
	next();
  };
  