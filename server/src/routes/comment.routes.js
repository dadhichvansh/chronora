import { Router } from 'express';
import { createComment, deleteComment } from '../controllers/comment.controller.js';

const router = Router();

router.post('/', createComment);
router.delete('/:commentId', deleteComment);

export default router;
