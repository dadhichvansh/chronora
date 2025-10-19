import { Router } from 'express';
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', authMiddleware, getCurrentUser);

export default router;
