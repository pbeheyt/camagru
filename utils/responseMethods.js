const fs = require('fs');

function sendFile(res, filePath) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.statusCode = 404;
            res.end('Not Found');
        } else {
            res.end(data);
        }
    });
}

function sendJson(res, data) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
}

function status(res, statusCode) {
    res.statusCode = statusCode;
    return res;
}

function redirect(res, location) {
    res.writeHead(302, { 'Location': location });
    res.end();
}

module.exports = {
    sendFile,
    sendJson,
    status,
    redirect
};

