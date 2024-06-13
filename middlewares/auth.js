const User = require('../models/User');

exports.validateResetToken = async (req, res, next) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ where: { passwordResetToken: token } });

    if (!user) {
      return res.redirect('/password-reset?error=' + encodeURIComponent('Invalid token'));
    }

    const tokenExpiration = user.getDataValue('passwordResetTokenExpiration');
    if (Date.now() > tokenExpiration) {
      return res.redirect('/password-reset?error=' + encodeURIComponent('Token has expired'));
    }

	
    res.locals.user = user;
	console.log(res.locals.user);
    next();
  } catch (error) {
    console.error('Error validating reset token:', error);
    res.status(500).redirect('/password-reset?error=' + encodeURIComponent('Internal Server Error'));
  }
};

