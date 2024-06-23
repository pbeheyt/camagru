const url = require('url');
const path = require('path');
const fs = require('fs');

class Router {
    constructor() {
        this.routes = [];
        this.middlewares = [];
    }

    use(middleware) {
        this.middlewares.push(middleware);
    }

    add(method, routePath, ...handlers) {
        const paramNames = [];
        let pathRegex;
        let isRegex = false;

        if (routePath instanceof RegExp) {
            pathRegex = routePath;
            isRegex = true;
        } else {
            pathRegex = routePath.replace(/\/:(\w+)/g, (_, paramName) => {
                paramNames.push(paramName);
                if (paramName === 'token') {
                    return '/([a-fA-F0-9]{40})';
                }
                if (paramName === 'id') {
                    return '/(\\d+)';
                }
                return '/([^/]+)';
            }).replace(/\/$/, '');

            pathRegex = new RegExp(`^${pathRegex}$`);
        }

        this.routes.push({ method, path: pathRegex, paramNames, handlers, isRegex });
    }

    async route(req, res) {
        const parsedUrl = url.parse(req.url, true);
        req.pathname = parsedUrl.pathname.replace(/\/+$/, '');
        req.query = parsedUrl.query;

        res.redirect = (location) => {
            res.writeHead(302, { 'Location': location });
            res.end();
        };

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

            const route = this.routes.find(r => r.method === req.method && r.path.test(req.pathname));

            if (route) {
                const matches = req.pathname.match(route.path);
                req.params = {};

                if (route.isRegex) {
                    // For regex routes, capture the entire match as a parameter
                    req.params[0] = matches ? matches[1] : null;
                } else {
                    route.paramNames.forEach((paramName, index) => {
                        req.params[paramName] = matches ? matches[index + 1] : null;
                    });
                }

                for (const handler of route.handlers) {
                    await runMiddleware(handler, req, res);
                }
            } else {
                console.log('No route matched');
                this.handle404(req, res);
            }
        } catch (err) {
            console.error('Error during routing:', err);
            this.handle500(err, req, res);
        }
    }

    handle404(req, res) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        const filePath = path.join(__dirname, 'views', 'main', '404.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.end('404 Not Found');
            } else {
                res.end(data);
            }
        });
    }

    handle500(err, req, res) {
        console.error('Error handling request:', err);
        res.statusCode = 500;
        res.end('Internal Server Error');
    }
}

module.exports = Router;
