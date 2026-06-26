import { Router } from 'express';
import { getMyLearningPlan } from '../controllers/learningPlanController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const learningPlanRoutes = Router();

learningPlanRoutes.get('/me', requireAuth, requireRole('student'), getMyLearningPlan);
