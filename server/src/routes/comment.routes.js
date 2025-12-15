import { Router } from 'express';
import { createComment } from '../controllers/comment.controller.js';

const router = Router();

router.post('/', createComment);

export default router;
