import { Router } from 'express';
import { generateExam } from '../controllers/examController.js';
import {
  saveExamAnswer,
  startExamAttempt,
  submitExamAttempt,
} from '../controllers/examAttemptController.js';
import { requireAuth } from '../middleware/auth.js';

export const examRoutes = Router();

examRoutes.get('/generate', requireAuth, generateExam);
examRoutes.post('/attempts', requireAuth, startExamAttempt);
examRoutes.patch('/attempts/:attemptId/answers/:questionId', requireAuth, saveExamAnswer);
examRoutes.post('/attempts/:attemptId/submit', requireAuth, submitExamAttempt);
