const http = require('http');
const sequelize = require('./database/init');
const Router = require('./Router');
const routes = require('./routes');
const { sessionMiddleware } = require('./middlewares/session');
const { sessionToLocals } = require('./middlewares/sessionToLocals');
const { parseJson } = require('./middlewares/parseJson');
const { parseUrlencoded} = require('./middlewares/parseUrlencoded');
const { serveStatic } = require('./middlewares/serveStatic');
const { sendFile, sendJson } = require('./utils/responseMethods');

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

router.use(parseJson);
router.use(parseUrlencoded);
router.use(serveStatic);
router.use(sessionMiddleware);
router.use(sessionToLocals);

routes(router);

const forceSync = process.env.FORCE_SYNC === 'true';

sequelize
    .authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
        const { User, Image, Comment, Like } = require('./models');
        User.associate({ Image, Comment, Like });
        Image.associate({ User, Comment, Like });
        Comment.associate({ User, Image });
        Like.associate({ User, Image });
        return sequelize.sync({ force: forceSync });
    })
    .then(() => {
        if (forceSync) {
            console.log('Database & tables created with force sync!');
        } else {
            console.log('Database synchronized without force sync.');
        }
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });
