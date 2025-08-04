import express from 'express';
import { createPost, getAllPosts, getPostsByUserId } from '../controllers/postController.js';
const router = express.Router();
router.post('/', createPost);
router.get('/', getAllPosts);
router.get('/user/:userId', getPostsByUserId);
export default router;