exports.parseJson = (req, res, next) => {
  if (req.headers['content-type'] === 'application/json') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      if (body) {
        try {
          req.body = JSON.parse(body);
        } catch (err) {
          return res.status(400).json({ success: false, error: 'Invalid JSON input' });
        }
      } else {
        req.body = {}; // If no body is provided, set req.body to an empty object
      }
      next();
    });

    req.on('error', err => {
      next(err);
    });

  } else {
    next();
  }
};
