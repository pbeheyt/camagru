const express = require('express');
const router = express.Router();
const { login, register } = require('./controllers/authController');

// Route for the home page
router.get(['/', '/home'], (req, res) => {
    res.render('home');
});


// Route for the login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Route for handling login form submission
router.post('/login', login);

// Route for the register page
router.get('/register', (req, res) => {
    res.render('register');
});

// Route for handling registration form submission
router.post('/register', register);

module.exports = router;
