import { Router } from 'express';
import { getAdaptiveLearningDashboard } from '../controllers/adaptiveLearningController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const adaptiveLearningRoutes = Router();

adaptiveLearningRoutes.get('/dashboard', requireAuth, requireRole('student'), getAdaptiveLearningDashboard);
