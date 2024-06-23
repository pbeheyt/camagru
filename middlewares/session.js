const cookie = require('cookie');
const crypto = require('crypto');

function generateUUID() {
    const randomBytes = crypto.randomBytes(16);

    // Set the version to 0100
    randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40;
    // Set the variant to 10xx
    randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80;

    const uuid = randomBytes.toString('hex').match(/.{1,4}/g).join('-');
    return uuid;
}

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
