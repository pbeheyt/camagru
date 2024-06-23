const fs = require('fs');
const path = require('path');
const url = require('url');

exports.serveStatic = (req, res, next) => {
    const parsedUrl = url.parse(req.url);
    const filePath = path.join(__dirname, '..', 'public', parsedUrl.pathname);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            next();
        } else {
            res.end(data);
        }
    });
};
