import { Router } from 'express';
import { getMyInsight, getParentInsight } from '../controllers/insightController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const insightRoutes = Router();

insightRoutes.get('/me', requireAuth, requireRole('student'), getMyInsight);
insightRoutes.get('/parent', requireAuth, requireRole('parent'), getParentInsight);
