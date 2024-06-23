const cookie = require('cookie');

exports.parseCookies = (req, res, next) => {
    req.cookies = cookie.parse(req.headers.cookie || '');
    next();
};