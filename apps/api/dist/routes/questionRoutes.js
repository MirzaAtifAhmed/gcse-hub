import { Router } from 'express';
import { getGeneratedPracticeQuestions } from '../controllers/generatedQuestionController.js';
import { listPracticeQuestions, submitPracticeAnswer, } from '../controllers/questionController.js';
import { requireAuth } from '../middleware/auth.js';
export const questionRoutes = Router();
questionRoutes.get('/practice', requireAuth, listPracticeQuestions);
questionRoutes.get('/generated-practice', requireAuth, getGeneratedPracticeQuestions);
questionRoutes.post('/:questionId/answer', requireAuth, submitPracticeAnswer);
