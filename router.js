const express = require('express');
const router = express.Router();
const path = require('path');
const loginController = require('./controllers/auth/login');
const registerController = require('./controllers/auth/register');
const passwordForgetController = require('./controllers/auth/password-forget');
const passwordResetController = require('./controllers/auth/password-reset');
const { validateAccount, validateResetToken, authenticateUser } = require('./middlewares/auth');
// const { updateUser } = require('./controllers/auth/profile');

// Home route (protected)
router.get('/home', authenticateUser, (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'main', 'home.html'));
});

// Profile route (protected)
router.get('/profile', authenticateUser, (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'main', 'profile.html'));
});
// router.post('/profile', authenticateUser, updateUser);

// Login
router.get('/login', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'auth', 'login.html'));
});
router.post('/login', loginController.handleLogin);

// Register
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'auth', 'register.html'));
});
router.post('/register', registerController.handleRegister);

// Account confirmation
router.get('/confirm/:token', validateAccount, (req, res) => {
	res.redirect('/login?success=' + encodeURIComponent('Your account has been successfully verified. Please log in.'));
});

// Forgot password
router.get('/password-forget', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'auth', 'password-forget.html'));
});
router.post('/password-forget', passwordForgetController.requestPasswordReset);

// Password reset
router.get('/password-reset', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'auth', 'password-reset.html'));
});
router.get('/password-reset/:token', validateResetToken, (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'auth', 'password-reset.html'));
});
router.post('/password-reset/:token', passwordResetController.resetPassword);

module.exports = router;
