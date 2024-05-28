// router.js

const express = require('express');
const router = express.Router();
const authController = require('./controllers/authController');
const confirmController = require('./controllers/confirmController');
const passwordController = require('./controllers/passwordController')


// Home
router.get(['/', '/home'], (req, res) => {
    res.render('home');
});

// Login
router.get('/login', authController.renderLoginPage);
router.post('/login', authController.handleLogin);

// Register
router.get('/register', authController.renderRegisterPage);
router.post('/register', authController.handleRegister);

// Forgot password
router.get('/forgot-password', passwordController.renderForgotPasswordPage);
router.post('/forgot-password', passwordController.requestPasswordReset);

// Password reset
router.get('/reset-password/:token', passwordController.handleResetTokenCheck);
router.post('/reset-password', passwordController.resetPassword);

// Account confirmation
router.get('/confirm/:token', confirmController.handleConfirmation);

module.exports = router;
