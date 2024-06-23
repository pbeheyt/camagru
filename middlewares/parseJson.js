exports.parseJson = (req, res, next) => {
  if (req.headers['content-type'] === 'application/json') {
      let body = '';
      req.on('data', chunk => {
          body += chunk.toString();
      });
      req.on('end', () => {
          try {
              req.body = JSON.parse(body);
              next();
          } catch (err) {
              next(err);
          }
      });
  } else {
      next();
  }
};
