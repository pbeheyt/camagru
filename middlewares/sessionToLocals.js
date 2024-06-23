exports.sessionToLocals = (req, res, next) => {
	res.locals = res.locals || {}; // Ensure res.locals is initialized
	res.locals.session = req.session;
	next();
};
