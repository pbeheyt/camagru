// authController.js

const escapeHtml = require('../utils/escapeHtml');
const isValidEmail = require('../utils/isValidEmail');
const user = require('../models/user');

exports.login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    const sanitizedUsername = escapeHtml(username);
    const sanitizedPassword = escapeHtml(password);

    console.log('Username:', sanitizedUsername);
    console.log('Password:', sanitizedPassword);

    res.redirect('/home');
};

exports.register = async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).send('Email, username, and password are required.');
    }

    if (!isValidEmail(email)) {
        return res.status(400).send('Invalid email format.');
    }
    if (password.length < 6) {
        return res.status(400).send('Password must be at least 6 characters long.');
    }

    const sanitizedEmail = escapeHtml(email);
    const sanitizedUsername = escapeHtml(username);
    const sanitizedPassword = escapeHtml(password);

    console.log('Email:', sanitizedEmail);
    console.log('Username:', sanitizedUsername);
    console.log('Password:', sanitizedPassword);

    try {
        const newUser = await user.create({
            email: sanitizedEmail,
            username: sanitizedUsername,
            password: sanitizedPassword
        });

        console.log('New user created:', newUser);

        res.redirect('/login');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal Server Error');
    }
};
