const router = require('express').Router();
const { body } = require('express-validator');
const catchAsyncErrors = require('../middlewares/catchAsyncError');
const { registerUser, loginUser, logoutUser,getAccountDetails,forgotPassword,profileImage,searchUsers, getUserDetails, followUser, unfollowUser} = require('../controllers/userController');
const validateRequest = require('../middlewares/validator'); // renamed for clarity
const isAuthenticated = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const validators = {
  register: [
    body('email').isEmail().withMessage("Enter a valid email"),
    body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body('name').notEmpty().withMessage("Name is required"),
    body('userName').notEmpty().withMessage("Username is required"),
  ],
  login: [
    body('email').isEmail().withMessage("Enter a valid email"),
    body('password').notEmpty().withMessage("Password is required"),
  ]
};

router.post('/register', validators.register, validateRequest, catchAsyncErrors(registerUser));
router.post('/login',  validateRequest, validators.login,catchAsyncErrors(loginUser));
router.get('/logout', isAuthenticated, catchAsyncErrors(logoutUser));
router.get('/me', isAuthenticated, catchAsyncErrors(getAccountDetails));
router.post('/email',catchAsyncErrors(forgotPassword));
router.post('/profile-image', isAuthenticated, upload.single('profileImage'), catchAsyncErrors(profileImage));
router.get('/search', isAuthenticated, catchAsyncErrors(searchUsers));
router.get('/profile/:username', isAuthenticated, catchAsyncErrors(getUserDetails));
router.post('/follow', isAuthenticated, catchAsyncErrors(followUser));
router.post('/unfollow', isAuthenticated, catchAsyncErrors(unfollowUser));

module.exports = router;

