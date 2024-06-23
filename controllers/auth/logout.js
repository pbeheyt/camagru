const { sessions } = require('../../middlewares/session');
const cookie = require('cookie');

exports.handleLogout = (req, res) => {
    const sessionId = req.cookies.sessionId;

    if (sessionId && sessions[sessionId]) {
        delete sessions[sessionId]; // Remove the session from the store

        // Clear the session cookie
        res.setHeader('Set-Cookie', cookie.serialize('sessionId', '', {
            httpOnly: true,
            maxAge: -1 // Expire the cookie immediately
        }));

        res.redirect('/login');
    } else {
        res.status(400).send('No active session found.');
    }
};