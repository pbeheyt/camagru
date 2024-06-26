const http = require('http');
const Router = require('./Router');
const routes = require('./routes');
const { sessionMiddleware } = require('./middlewares/session');
const { sessionToLocals } = require('./middlewares/sessionToLocals');
const { parseCookies } = require('./middlewares/parseCookies');
const { parseJson } = require('./middlewares/parseJson');
const { parseUrlencoded} = require('./middlewares/parseUrlencoded');
const { serveStatic } = require('./middlewares/serveStatic');
const { sendFile, sendJson } = require('./utils/responseMethods');
const { connectToDatabase } = require('./database/connect');
const { initializeDatabase } = require('./database/init');

const router = new Router();

const server = http.createServer((req, res) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);

    res.locals = {};

    res.sendFile = (filePath) => sendFile(res, filePath);
    res.json = (data) => sendJson(res, data);

    res.status = (statusCode) => {
      res.statusCode = statusCode;
      return res;
    };

    router.route(req, res);
});

router.use(parseCookies);
router.use(parseJson);
router.use(parseUrlencoded);
router.use(serveStatic);
router.use(sessionMiddleware);
router.use(sessionToLocals);

routes(router);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
      await connectToDatabase();
      await initializeDatabase();
      server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      });
  } catch (error) {
      console.error('Unable to start the server:', error);
  }
};

startServer();