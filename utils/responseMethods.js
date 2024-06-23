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

module.exports = {
    sendFile,
    sendJson
};
