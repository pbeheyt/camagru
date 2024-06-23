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
        // Convert the path to a regex and store the parameter names
        const paramNames = [];
        const pathRegex = routePath.replace(/\/:(\w+)/g, (_, paramName) => {
            paramNames.push(paramName);
            if (paramName === 'token') {
                return '/([a-fA-F0-9]{40})'; // Regex pattern for token
            }
            if (paramName === 'id') {
                return '/(\\d+)'; // Regex pattern for integer ID
            }
            return '/([^/]+)'; // Default pattern for other parameters
        }).replace(/\/$/, ''); // Remove trailing slashes

        const regex = new RegExp(`^${pathRegex}$`);

        this.routes.push({ method, path: regex, paramNames, handlers });
    }

    async route(req, res) {
        const parsedUrl = url.parse(req.url, true);
        req.pathname = parsedUrl.pathname.replace(/\/+$/, ''); // Normalize request path
        req.query = parsedUrl.query;

        // Add custom redirect method
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
            console.log(`Routing request: ${req.method} ${req.url}`);
            console.log(`Parsed pathname: ${req.pathname}`);
            console.log(`Parsed query: ${JSON.stringify(req.query)}`);

            console.log('Running middlewares...');
            for (const middleware of this.middlewares) {
                console.log(`Running middleware: ${middleware.name || 'anonymous'}`);
                await runMiddleware(middleware, req, res);
            }

            console.log('Available routes:', this.routes);
            const route = this.routes.find(r => r.method === req.method && r.path.test(req.pathname));
            console.log('Matched route:', route);

            if (route) {
                // Extract parameters and add them to the req object
                const matches = req.pathname.match(route.path);
                req.params = {};
                route.paramNames.forEach((paramName, index) => {
                    req.params[paramName] = matches[index + 1];
                });

                console.log('Extracted params:', req.params);

                console.log('Running route handlers...');
                for (const handler of route.handlers) {
                    console.log(`Running handler: ${handler.name || 'anonymous'}`);
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
