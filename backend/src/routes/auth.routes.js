const express = require('express');
const router = express.Router();
const {
    login,
    getMe,
    inviteUser,
    register,
    forgotPassword,
    resetPassword,
    changePassword,
    logout
} = require('../controllers/auth.controller');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);
router.post('/logout', protect, logout);

// Admin only
router.post('/invite', protect, authorize('admin'), inviteUser);

module.exports = router;
