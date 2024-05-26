// router.js

const express = require('express');
const router = express.Router();
const authController = require('./controllers/authController');

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

module.exports = router;
