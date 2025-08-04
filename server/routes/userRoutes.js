import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
    changePassword,
    searchUsers
} from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/search', searchUsers); // Search route must be before '/:id'
router.get('/:id', getUserProfile);

router.put('/profile', protect, updateUserProfile);
router.put('/change-password', protect, changePassword);

export default router;