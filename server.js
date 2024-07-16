const http = require('http');
const Router = require('./Router');
const routes = require('./routes');
const path = require('path');

// Load environment variables
const loadEnv = require('./utils/loadEnv');
loadEnv(path.join(__dirname, '.env'));

const { sessionMiddleware } = require('./middlewares/session');
const { sessionToLocals } = require('./middlewares/sessionToLocals');
const { parseCookies } = require('./middlewares/parseCookies');
const { parseJson } = require('./middlewares/parseJson');
const { parseUrlencoded} = require('./middlewares/parseUrlencoded');
const { serveStatic } = require('./middlewares/serveStatic');
const { sendFile, sendJson, status, redirect } = require('./utils/responseMethods');
const { connectToDatabase } = require('./database/connect');
const { initializeDatabase } = require('./database/init');

const router = new Router();
const server = http.createServer((req, res) => {
    // console.log(`Incoming request: ${req.method} ${req.url}`);

    res.locals = {};

    res.locals = {};

    res.sendFile = (filePath) => sendFile(res, filePath);
    res.json = (data) => sendJson(res, data);
    res.status = (statusCode) => status(res, statusCode);
    res.redirect = (location) => redirect(res, location);

    router.route(req, res);
});

router.use(parseCookies);
router.use(sessionMiddleware);
router.use(sessionToLocals);
router.use(parseJson);
router.use(parseUrlencoded);
router.use(serveStatic);  

routes(router);

const startServer = async () => {
  try {
      await connectToDatabase();
      await initializeDatabase();
      server.listen(process.env.PORT);
  } catch (error) {
      console.error('Unable to start the server:', error);
  }
};

startServer();