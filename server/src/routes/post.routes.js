import { Router } from 'express';
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  getUserPosts,
  updatePost,
} from '../controllers/post.controller.js';
import { uploadCoverImage } from '../middlewares/upload.middleware.js';

const router = Router();

// Public route to get all posts
router.get('/', getAllPosts);

// Protected routes for creating, updating, and deleting posts
router.post('/', uploadCoverImage, createPost);
router.get('/:userId', getUserPosts);
router.get('/:postId', getPostById);
router.put('/:postId', uploadCoverImage, updatePost);
router.delete('/:postId', deletePost);

export default router;
