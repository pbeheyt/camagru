const path = require('path');
const logoutController = require('./controllers/auth/logout');
const loginController = require('./controllers/auth/login');
const registerController = require('./controllers/auth/register');
const passwordForgetController = require('./controllers/auth/password-forget');
const passwordResetController = require('./controllers/auth/password-reset');
const authMiddleware = require('./middlewares/auth');
const profileController = require('./controllers/main/profile');
const galleryController = require('./controllers/main/gallery');
const studioController = require('./controllers/main/studio');
const imgurController = require('./controllers/social/imgurController');

module.exports = function(router) {
    // Serve the favicon
    router.add('GET', '/favicon.ico', (req, res) => {
      const filePath = path.join(__dirname, 'public', 'favicon.ico');
      res.sendFile(filePath);
    });

    // Serve static files from the uploads directory
    router.add('GET', /^\/uploads\/(.+)$/, (req, res) => {
      const filePath = path.join(__dirname, 'uploads', req.params[0]);
      res.sendFile(filePath);
    });

    router.add('GET', '/', (req, res) => {
        const filePath = res.locals && res.locals.isAuthenticated
            ? path.join(__dirname, 'views', 'main', 'home.html')
            : path.join(__dirname, 'views', 'main', 'home-public.html');
        res.sendFile(filePath);
    });

    router.add('GET', '/profile', authMiddleware.authenticateUser, (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'main', 'profile.html'));
    });
    router.add('POST', '/change-info', authMiddleware.authenticateUser, profileController.updateUserInfo);
    router.add('POST', '/change-password', authMiddleware.authenticateUser, profileController.updateUserPassword);
    router.add('GET', '/profile-info', authMiddleware.authenticateUser, profileController.getUserInfo);

    router.add('GET', '/login', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'auth', 'login.html'));
    });
    router.add('POST', '/login', loginController.handleLogin);

    router.add('GET', '/logout', logoutController.handleLogout);

    router.add('GET', '/register', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'auth', 'register.html'));
    });
    router.add('POST', '/register', registerController.handleRegister);

    router.add('GET', '/confirm/:token', authMiddleware.validateAccount, (req, res) => {
        res.redirect('/login?success=' + encodeURIComponent('Your account has been successfully verified. Please log in.'));
    });

    router.add('GET', '/password-forget', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'auth', 'password-forget.html'));
    });
    router.add('POST', '/password-forget', passwordForgetController.requestPasswordReset);

    router.add('GET', '/password-reset', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'auth', 'password-reset.html'));
    });
    router.add('GET', '/password-reset/:token', authMiddleware.validateResetToken, (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'auth', 'password-reset.html'));
    });
    router.add('POST', '/password-reset/:token', passwordResetController.resetPassword);

    router.add('GET', '/images', galleryController.getImages);
    router.add('POST', '/images/:id/like', authMiddleware.authenticateUser, galleryController.likeImage);
    router.add('POST', '/images/:id/comment', authMiddleware.authenticateUser, galleryController.commentImage);

    router.add('GET', '/studio', authMiddleware.authenticateUser, (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'main', 'studio.html'));
    });
    router.add('POST', '/studio/upload', authMiddleware.authenticateUser, studioController.uploadImage);
    router.add('POST', '/studio/capture', authMiddleware.authenticateUser, studioController.captureImage);
    router.add('POST', '/studio/post', authMiddleware.authenticateUser, studioController.postImage);
    router.add('DELETE', '/studio/delete/:id', authMiddleware.authenticateUser, studioController.deleteImage);
    router.add('POST', '/studio/create-gif', authMiddleware.authenticateUser, studioController.createAnimatedGIF);

    router.add('GET', '/images/superposable', studioController.getSuperposableImages);

    router.add('POST', '/studio/share-imgur', authMiddleware.authenticateUser, imgurController.shareOnImgur);

    router.add('GET', '/auth/check', (req, res) => {
        res.json({ authenticated: req.session && req.session.userId ? true : false });
    });

    // router.add('USE', '*', (req, res) => {
    //     res.statusCode = 404;
    //     res.sendFile(path.join(__dirname, 'views', 'main', '404.html'));
    // });
};
