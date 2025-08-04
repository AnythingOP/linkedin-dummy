import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
    changePassword
} from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to get a user profile
router.get('/:id', getUserProfile);

// Protected routes for editing
router.put('/profile', protect, updateUserProfile);
router.put('/change-password', protect, changePassword);

export default router;