import { Router } from 'express';
import { listPracticeQuestions } from '../controllers/questionController.js';
import { requireAuth } from '../middleware/auth.js';

export const questionRoutes = Router();

questionRoutes.get('/practice', requireAuth, listPracticeQuestions);
