exports.handleLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Could not log out.');
        } else {
            res.redirect('/login');
        }
    });
};
