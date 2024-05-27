// router.js

const express = require('express');
const router = express.Router();
const authController = require('./controllers/authController');
const confirmController = require('./controllers/confirmController');

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
router.get('/confirm/:token', confirmController.handleConfirmation);

module.exports = router;
