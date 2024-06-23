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
            res.writeHead(200, { 'Content-Type': getContentType(filePath) });
            res.end(data);
        }
    });
};

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
      case '.html':
          return 'text/html';
      case '.js':
          return 'application/javascript';
      case '.css':
          return 'text/css';
      case '.json':
          return 'application/json';
      case '.png':
          return 'image/png';
      case '.jpg':
          return 'image/jpeg';
      case '.ico':
          return 'image/x-icon';
      default:
          return 'application/octet-stream';
  }
}
