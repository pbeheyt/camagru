const path = require('path');
const logoutController = require('./controllers/auth/logout');
const loginController = require('./controllers/auth/login');
const registerController = require('./controllers/auth/register');
const passwordForgetController = require('./controllers/auth/password-forget');
const passwordResetController = require('./controllers/auth/password-reset');
const authController = require('./middlewares/auth');
const profileController = require('./controllers/main/profile');
const galleryController = require('./controllers/main/gallery');
const studioController = require('./controllers/main/studio');
const imgurController = require('./controllers/social/imgurController');

module.exports = function(router) {
    router.add('GET', '/', (req, res) => {
        const filePath = res.locals && res.locals.isAuthenticated
            ? path.join(__dirname, 'views', 'main', 'home.html')
            : path.join(__dirname, 'views', 'main', 'home-public.html');
        res.sendFile(filePath);
    });

    router.add('GET', '/profile', authController.authenticateUser, (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'main', 'profile.html'));
    });
    router.add('POST', '/change-info', authController.authenticateUser, profileController.updateUserInfo);
    router.add('POST', '/change-password', authController.authenticateUser, profileController.updateUserPassword);
    router.add('GET', '/profile-info', authController.authenticateUser, profileController.getUserInfo);

    router.add('GET', '/login', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'auth', 'login.html'));
    });
    router.add('POST', '/login', loginController.handleLogin);

    router.add('GET', '/logout', logoutController.handleLogout);

    router.add('GET', '/register', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'auth', 'register.html'));
    });
    router.add('POST', '/register', registerController.handleRegister);

    router.add('GET', '/confirm/:token', authController.validateAccount, (req, res) => {
        res.redirect('/login?success=' + encodeURIComponent('Your account has been successfully verified. Please log in.'));
    });

    router.add('GET', '/password-forget', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'auth', 'password-forget.html'));
    });
    router.add('POST', '/password-forget', passwordForgetController.requestPasswordReset);

    router.add('GET', '/password-reset', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'auth', 'password-reset.html'));
    });
    router.add('GET', '/password-reset/:token', authController.validateResetToken, (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'auth', 'password-reset.html'));
    });
    router.add('POST', '/password-reset/:token', passwordResetController.resetPassword);

    router.add('GET', '/images', galleryController.getImages);
    router.add('POST', '/images/:id/like', authController.authenticateUser, galleryController.likeImage);
    router.add('POST', '/images/:id/comment', authController.authenticateUser, galleryController.commentImage);

    router.add('GET', '/studio', authController.authenticateUser, (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'main', 'studio.html'));
    });
    router.add('POST', '/studio/upload', authController.authenticateUser, studioController.uploadImage);
    router.add('POST', '/studio/capture', authController.authenticateUser, studioController.captureImage);
    router.add('POST', '/studio/post', authController.authenticateUser, studioController.postImage);
    router.add('DELETE', '/studio/delete/:id', authController.authenticateUser, studioController.deleteImage);
    router.add('POST', '/studio/create-gif', authController.authenticateUser, studioController.createAnimatedGIF);

    router.add('GET', '/images/superposable', studioController.getSuperposableImages);

    router.add('POST', '/studio/share-imgur', authController.authenticateUser, imgurController.shareOnImgur);

    router.add('GET', '/auth/check', (req, res) => {
        res.json({ authenticated: req.session && req.session.userId ? true : false });
    });

    router.add('USE', '*', (req, res) => {
        res.statusCode = 404;
        res.sendFile(path.join(__dirname, 'views', 'main', '404.html'));
    });
};
