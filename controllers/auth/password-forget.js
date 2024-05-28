const User = require('../../models/User');
const { generateToken, getTokenExpiration, sendPasswordResetEmail } = require('../../utils');

exports.renderForgotPasswordPage = (req, res) => {
	res.render('password-forget');
  };

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(404).render('password-forget', { error: 'User not found' });
  }

  const token = generateToken();
  console.log(`Generated token: ${token}`);
  user.passwordResetToken = token;
  user.passwordResetExpires = getTokenExpiration();
  await user.save();
  console.log(`Saved user with token: ${user.passwordResetToken}`);

  await sendPasswordResetEmail(user, req);

  res.status(200).render('password-forget', { success: 'Password reset request sent' });
};

