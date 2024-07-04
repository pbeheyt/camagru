const cookie = require('cookie');
const generateUUID = require('../utils/uuid');

const sessions = {};

exports.sessionMiddleware = (req, res, next) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const sessionId = cookies.sessionId;

  if (sessionId && sessions[sessionId]) {
      req.session = sessions[sessionId];
  } else {
      req.session = {};
  }

  next();
};

exports.sessions = sessions;