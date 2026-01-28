import { Router } from 'express';
import {
  addProfileImage,
  getCurrentUser,
  removeProfileImage,
  updateDisplayName,
} from '../controllers/user.controller.js';
import { uploadProfileImage } from '../middlewares/upload.middleware.js';

const router = Router();

// User routes
router.get('/me', getCurrentUser);
router.put('/me/displayname', updateDisplayName);
router.post('/me/avatar', uploadProfileImage, addProfileImage);
router.delete('/me/avatar', removeProfileImage);

export default router;
