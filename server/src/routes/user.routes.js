import { Router } from 'express';
import { getCurrentUser } from '../controllers/user.controller.js';

const router = Router();

// Get current user
router.get('/me', getCurrentUser);

export default router;
