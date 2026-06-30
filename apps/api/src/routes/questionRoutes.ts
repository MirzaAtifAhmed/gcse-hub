import { Router } from 'express';
import { submitGeneratedAnswer } from '../controllers/generatedAnswerController.js';
import { getIntelligentPractice, getPracticeBuilderOptions } from '../controllers/intelligentPracticeController.js';
import { getGeneratedPracticeQuestions } from '../controllers/generatedQuestionController.js';
import {
  listPracticeQuestions,
  submitPracticeAnswer,
} from '../controllers/questionController.js';
import { requireAuth } from '../middleware/auth.js';

export const questionRoutes = Router();

questionRoutes.get('/practice', requireAuth, listPracticeQuestions);
questionRoutes.get('/generated-practice', requireAuth, getGeneratedPracticeQuestions);
questionRoutes.get('/practice-builder-options', requireAuth, getPracticeBuilderOptions);
questionRoutes.get('/intelligent-practice', requireAuth, getIntelligentPractice);
questionRoutes.post('/generated-answer', requireAuth, submitGeneratedAnswer);
questionRoutes.post('/:questionId/answer', requireAuth, submitPracticeAnswer);
