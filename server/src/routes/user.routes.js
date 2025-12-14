import { Router } from 'express';
import { getCurrentUser, updateProfile } from '../controllers/user.controller.js';
import { uploadProfileImage } from '../middlewares/upload.middleware.js';

const router = Router();

// User routes
router.get('/me', getCurrentUser);
router.put('/me', uploadProfileImage, updateProfile);

export default router;
