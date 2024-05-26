// authController.js

const escapeHtml = require('../utils/escapeHtml');
const isValidEmail = require('../utils/isValidEmail');
const user = require('../models/user');
const bcrypt = require('bcrypt');

exports.renderLoginPage = (req, res) => {
    res.render('login', { error: null });
};

exports.handleLogin = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).render('login', { error: 'Username and password are required.' });
    }

    const sanitizedUsername = escapeHtml(username);
    const sanitizedPassword = escapeHtml(password);

    console.log('Username:', sanitizedUsername);
    console.log('Password:', sanitizedPassword);

    // Placeholder for authentication logic (e.g., checking username and password against the database)
    const isValidUser = true; // Replace with actual validation

    if (!isValidUser) {
        return res.status(401).render('login', { error: 'Invalid username or password.' });
    }

    res.redirect('/home');
};

exports.renderRegisterPage = (req, res) => {
    res.render('register', { error: null });
};

exports.handleRegister = async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).render('register', { error: 'Email, username, and password are required.' });
    }

    if (!isValidEmail(email)) {
        return res.status(400).render('register', { error: 'Invalid email format.' });
    }
    if (password.length < 6) {
        return res.status(400).render('register', { error: 'Password must be at least 6 characters long.' });
    }

    const sanitizedEmail = escapeHtml(email);
    const sanitizedUsername = escapeHtml(username);
    const sanitizedPassword = escapeHtml(password);

    console.log('Email:', sanitizedEmail);
    console.log('Username:', sanitizedUsername);
    console.log('Password:', sanitizedPassword);

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);
        const newUser = await user.create({
            email: sanitizedEmail,
            username: sanitizedUsername,
            password: hashedPassword
        });

        console.log('New user created:', newUser);

        res.redirect('/login');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal Server Error');
    }
};
