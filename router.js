const express = require('express');
const router = express.Router();
const loginController = require('./controllers/auth/login');
const registerController = require('./controllers/auth/register');
const accountVerifController = require('./controllers/auth/account-verif');
const passwordForgetController = require('./controllers/auth/password-forget');
const passwordResetController = require('./controllers/auth/password-reset');

// Home
router.get(['/', '/home'], (req, res) => {
    res.render('home');
});

// Login
router.get('/login', loginController.renderLoginPage);
router.post('/login', loginController.handleLogin);

// Register
router.get('/register', registerController.renderRegisterPage);
router.post('/register', registerController.handleRegister);

// Account confirmation
router.get('/confirm/:token', accountVerifController.handleConfirmation);

// Forgot password
router.get('/password-forget', passwordForgetController.renderForgotPasswordPage);
router.post('/password-forget', passwordForgetController.requestPasswordReset);

// Password reset
router.get('/password-reset/:token', passwordResetController.handleResetTokenCheck);
router.post('/password-reset', passwordResetController.resetPassword);

module.exports = router;
