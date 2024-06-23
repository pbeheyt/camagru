const { parse } = require('querystring');

exports.parseUrlencoded = (req, res, next) => {
    if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            req.body = parse(body);
            next();
        });
    } else {
        next();
    }
};
