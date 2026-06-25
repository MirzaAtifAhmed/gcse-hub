import { Router } from 'express';
import {
  listPracticeQuestions,
  submitPracticeAnswer,
} from '../controllers/questionController.js';
import { requireAuth } from '../middleware/auth.js';

export const questionRoutes = Router();

questionRoutes.get('/practice', requireAuth, listPracticeQuestions);
questionRoutes.post('/:questionId/answer', requireAuth, submitPracticeAnswer);
