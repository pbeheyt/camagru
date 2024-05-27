// authController.js

const { escapeHtml, isValidEmail, isValidPassword, authenticateUser } = require('../utils')

const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.renderLoginPage = (req, res) => {
    res.render('login', { error: null });
};

exports.handleLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).render('login', { error: 'Username and password are required.' });
    }

    const sanitizedUsername = escapeHtml(username);
    const sanitizedPassword = escapeHtml(password);

    console.log('Username:', sanitizedUsername);
    console.log('Password:', sanitizedPassword);

    try {
        const User = await authenticateUser(sanitizedUsername, sanitizedPassword);
        if (!User) {
            return res.status(401).render('login', { error: 'Invalid username or password.' });
        }
        res.redirect('/home');
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(500).send('Internal Server Error');
    }
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

    if (!isValidPassword(password)) {
        return res.status(400).render('register', { error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.' });
    }

    const sanitizedEmail = escapeHtml(email);
    const sanitizedUsername = escapeHtml(username);
    const sanitizedPassword = escapeHtml(password);

    console.log('Email:', sanitizedEmail);
    console.log('Username:', sanitizedUsername);
    console.log('Password:', sanitizedPassword);

    try {
        const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);
        const newUser = await User.create({
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
