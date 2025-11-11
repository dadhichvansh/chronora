import { Router } from 'express';
import {
  createPost,
  deletePost,
  getAllPosts,
  getUserPosts,
  updatePost,
} from '../controllers/post.controller.js';

const router = Router();

// Public route to get all posts
router.get('/', getAllPosts);

// Protected routes for creating, updating, and deleting posts
router.post('/', createPost);
router.get('/:userId', getUserPosts);
router.put('/:postId', updatePost);
router.delete('/:postId', deletePost);

export default router;
