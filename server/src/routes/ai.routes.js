import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  fixGrammar,
  generateBlog,
  generateTitles,
  improveContent,
} from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/generate-blog', authMiddleware, generateBlog);
router.post('/generate-titles', authMiddleware, generateTitles);
router.post('/fix-grammar', authMiddleware, fixGrammar);
router.post('/improve-content', authMiddleware, improveContent);

export default router;
