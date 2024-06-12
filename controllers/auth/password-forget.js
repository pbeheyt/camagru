const User = require('../../models/User');
const { generateToken, getTokenExpiration, sendPasswordResetEmail } = require('../../utils');
const path = require('path');

exports.renderForgotPasswordPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'views', 'password-forget.html'));
};
exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    console.log('email :', email);

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const token = generateToken();
        console.log(`Generated token: ${token}`);
        user.passwordResetToken = token;
        user.passwordResetExpires = getTokenExpiration();
        await user.save();
        console.log(`Saved user with token: ${user.passwordResetToken}`);

        await sendPasswordResetEmail(user, req);

        return res.json({ success: 'Password reset request sent' });
    } catch (error) {
        console.error('Error requesting password reset:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


