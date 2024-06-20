const express = require('express');
const router = express.Router();
const path = require('path');
const logoutController = require('./controllers/auth/logout');
const loginController = require('./controllers/auth/login');
const registerController = require('./controllers/auth/register');
const passwordForgetController = require('./controllers/auth/password-forget');
const passwordResetController = require('./controllers/auth/password-reset');
const { validateAccount, validateResetToken, authenticateUser } = require('./middlewares/auth');
const { updateUserInfo, updateUserPassword, getUserInfo } = require('./controllers/main/profile');
const { getImages, likeImage, commentImage, uploadImage } = require('./controllers/main/gallery');

// Home route (protected)
router.get(['/home', '/'], authenticateUser, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'main', 'home.html'));
});

// Profile route (protected)
router.get('/profile', authenticateUser, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'main', 'profile.html'));
});
router.post('/change-info', authenticateUser, updateUserInfo);
router.post('/change-password', authenticateUser, updateUserPassword);
router.get('/profile-info', authenticateUser, getUserInfo);

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
router.get('/confirm/:token', validateAccount, (req, res) => {
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
router.get('/password-reset/:token', validateResetToken, (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'auth', 'password-reset.html'));
});
router.post('/password-reset/:token', passwordResetController.resetPassword);

// Gallery
// Fetch images with pagination
router.get('/images', getImages);

// Like an image
router.post('/images/:id/like', authenticateUser, likeImage);

// Comment on an image
router.post('/images/:id/comment', authenticateUser, commentImage);

// Image upload page
router.get('/upload', authenticateUser, (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'main', 'upload.html'));
});
  
// Image upload route
router.post('/upload', uploadImage);


// Catch-all route for 404 errors
router.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', 'main', '404.html'));
});

module.exports = router;
