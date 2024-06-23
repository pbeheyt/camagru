exports.sessionToLocals = (req, res, next) => {
	res.locals = res.locals || {}; // Ensure res.locals is initialized
	res.locals.session = req.session;
	res.locals.isAuthenticated = !!req.session.userId; // Assuming userId is stored in session
	next();
};
