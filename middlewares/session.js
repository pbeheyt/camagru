const cookie = require('cookie');
const generateUUID = require('../utils/uuid');

const sessions = {};

exports.sessionMiddleware = (req, res, next) => {
    const cookies = cookie.parse(req.headers.cookie || '');
    let sessionId = cookies.sessionId;

    if (!sessionId || !sessions[sessionId]) {
        sessionId = generateUUID();
        sessions[sessionId] = {};
        res.setHeader('Set-Cookie', cookie.serialize('sessionId', sessionId, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7 // 1 week
        }));
    }

    req.session = sessions[sessionId];

    next();
};

exports.sessions = sessions;