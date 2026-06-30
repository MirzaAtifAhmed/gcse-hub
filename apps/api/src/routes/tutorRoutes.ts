import { Router } from 'express';
import { getTutorHint } from '../controllers/tutorController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const tutorRoutes = Router();

tutorRoutes.post('/hint', requireAuth, requireRole('student'), getTutorHint);
