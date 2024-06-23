const url = require('url');

class Router {
    constructor() {
        this.routes = [];
        this.middlewares = [];
    }

    use(middleware) {
        this.middlewares.push(middleware);
    }

    add(method, path, ...handlers) {
        this.routes.push({ method, path, handlers });
    }

    async route(req, res) {
        const parsedUrl = url.parse(req.url, true);
        req.pathname = parsedUrl.pathname;
        req.query = parsedUrl.query;

        const runMiddleware = async (middleware, req, res) => {
            return new Promise((resolve, reject) => {
                middleware(req, res, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        };

        try {
            for (const middleware of this.middlewares) {
                await runMiddleware(middleware, req, res);
            }

            const route = this.routes.find(r => r.method === req.method && new RegExp(`^${r.path}$`).test(req.pathname));
            if (route) {
                for (const handler of route.handlers) {
                    await runMiddleware(handler, req, res);
                }
            } else {
                this.handle404(req, res);
            }
        } catch (err) {
            this.handle500(err, req, res);
        }
    }

    handle404(req, res) {
        res.statusCode = 404;
        res.end('Not Found');
    }

    handle500(err, req, res) {
        console.error(err);
        res.statusCode = 500;
        res.end('Internal Server Error');
    }
}

module.exports = Router;
