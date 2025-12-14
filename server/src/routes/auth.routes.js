import { Router } from 'express';
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/auth.controller.js';

const router = Router();

// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;
