const express = require('express');
const router = express.Router();
const path = require('path');

// Route for the home page
router.get('/', (req, res) => {
    res.render('home');
});

// Route for the login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Route for the register page
router.get('/register', (req, res) => {
    res.render('register');
});

module.exports = router;
