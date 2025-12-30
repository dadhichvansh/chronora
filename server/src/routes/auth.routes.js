import { Router } from 'express';
import {
  loginUser,
  logoutUser,
  registerUser,
  changePassword,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller.js';

const router = Router();

// User auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.put('/change-password', changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
