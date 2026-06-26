import { Router } from 'express';
import { getMyMastery } from '../controllers/masteryController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const masteryRoutes = Router();

masteryRoutes.get('/me', requireAuth, requireRole('student'), getMyMastery);
