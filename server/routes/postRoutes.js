import express from 'express';
import {
    createPost,
    getAllPosts,
    getPostsByUserId,
    likePost,
    addComment,
    getCommentsForPost
} from '../controllers/postController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getAllPosts)
    .post(protect, createPost);

router.route('/user/:userId').get(getPostsByUserId);

router.route('/:id/like').post(protect, likePost);

router.route('/:id/comments')
    .get(getCommentsForPost)
    .post(protect, addComment);

export default router;