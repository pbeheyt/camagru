const express = require('express');
const router = express.Router();
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

// Home route
router.get(['/home', '/'], (req, res) => {
  const filePath = res.locals.isAuthenticated
    ? path.join(__dirname, 'views', 'main', 'home.html')
    : path.join(__dirname, 'views', 'main', 'home-public.html');
  res.sendFile(filePath);
});

// Profile route (protected)
router.get('/profile', authController.authenticateUser, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'main', 'profile.html'));
});
router.post('/change-info', authController.authenticateUser, profileController.updateUserInfo);
router.post('/change-password', authController.authenticateUser, profileController.updateUserPassword);
router.get('/profile-info', authController.authenticateUser, profileController.getUserInfo);

// Login
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'auth', 'login.html'));
});
router.post('/login', loginController.handleLogin);

// Logout route
router.get('/logout', logoutController.handleLogout);

// Register
router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'auth', 'register.html'));
});
router.post('/register', registerController.handleRegister);

// Account confirmation
router.get('/confirm/:token', authController.validateAccount, (req, res) => {
  res.redirect('/login?success=' + encodeURIComponent('Your account has been successfully verified. Please log in.'));
});

// Forgot password
router.get('/password-forget', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'auth', 'password-forget.html'));
});
router.post('/password-forget', passwordForgetController.requestPasswordReset);

// Password reset
router.get('/password-reset', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'auth', 'password-reset.html'));
});
router.get('/password-reset/:token', authController.validateResetToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'auth', 'password-reset.html'));
});
router.post('/password-reset/:token', passwordResetController.resetPassword);

// Gallery
router.get('/images', galleryController.getImages);
router.post('/images/:id/like', authController.authenticateUser, galleryController.likeImage);
router.post('/images/:id/comment', authController.authenticateUser, galleryController.commentImage);

// studio
router.get('/studio', authController.authenticateUser,  (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'main', 'studio.html'));
});
router.post('/studio/upload', authController.authenticateUser, studioController.uploadImage);
router.post('/studio/capture', authController.authenticateUser, studioController.captureImage);
router.post('/studio/post', authController.authenticateUser, studioController.postImage);
router.delete('/studio/delete/:id', authController.authenticateUser, studioController.deleteImage);
router.post('/studio/create-gif', authController.authenticateUser, studioController.createAnimatedGIF);

// Add the route for fetching superposable images
router.get('/images/superposable', studioController.getSuperposableImages);

// Add the new route for sharing on Imgur
router.post('/studio/share-imgur', authController.authenticateUser, imgurController.shareOnImgur);

// Add the authentication check route
router.get('/auth/check', (req, res) => {
  res.json({ authenticated: req.session.userId ? true : false });
});

// Catch-all route for 404 errors
router.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', 'main', '404.html'));
});

module.exports = router;
