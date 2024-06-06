const bcrypt = require('bcrypt');
const User = require('../../models/User');
const { escapeHtml, isValidEmail, isValidPassword, generateToken, sendConfirmationEmail } = require('../../utils');
const path = require('path');

exports.renderRegisterPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'views', 'register.html'));
};

exports.handleRegister = async (req, res) => {
    const { email, username, password, 'confirm-password': confirmPassword } = req.body;

    if (!email || !username || !password || !confirmPassword) {
        return res.status(400).json({ error: 'Email, username, and password are required.' });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    if (!isValidPassword(password)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const sanitizedEmail = escapeHtml(email);
    const sanitizedUsername = escapeHtml(username);
    const sanitizedPassword = escapeHtml(password);

    console.log('Email:', sanitizedEmail);
    console.log('Username:', sanitizedUsername);
    console.log('Password:', sanitizedPassword);

    try {
        const existingUser = await User.findOne({ where: { email: sanitizedEmail } });
        if (existingUser) {
            return res.status(409).json({ error: 'Email address is already in use.' });
        }

        const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);
        const confirmationToken = generateToken();

        const newUser = await User.create({
            email: sanitizedEmail,
            username: sanitizedUsername,
            password: hashedPassword,
            confirmationToken,
            isConfirmed: false,
        });

        await sendConfirmationEmail(newUser, req);

        console.log('New user created:', newUser);

        return res.status(201).json({ success: 'Your account has been successfully registered! Please check your email to confirm your account and complete the registration process.' });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

