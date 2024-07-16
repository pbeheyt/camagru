const { escapeHtml, authenticateUser } = require('../../utils');
const { sessions } = require('../../middlewares/session');
const generateUUID = require('../../utils/uuid');
const cookie = require('cookie');

exports.handleLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    const sanitizedUsername = escapeHtml(username);
    const sanitizedPassword = escapeHtml(password);

    try {
        const user = await authenticateUser(sanitizedUsername, sanitizedPassword);
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }
        if (!user.isConfirmed) {
            return res.status(401).json({ error: 'Account not confirmed. Please check your email.' });
        }

        // Generate a new session ID and store the user ID in the session
        const sessionId = generateUUID();
        sessions[sessionId] = { userId: user.id };

        // Set the session cookie
        res.setHeader('Set-Cookie', cookie.serialize('sessionId', sessionId, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7 // 1 week
        }));

        res.status(200).json({ success: 'Login successful.' });
    } catch (error) {
        // console.error('Error authenticating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
