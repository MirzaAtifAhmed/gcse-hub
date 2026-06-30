import { Router } from 'express';
import { getMyRevisionPlanner } from '../controllers/revisionPlannerController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const revisionPlannerRoutes = Router();

revisionPlannerRoutes.get('/me', requireAuth, requireRole('student'), getMyRevisionPlanner);
