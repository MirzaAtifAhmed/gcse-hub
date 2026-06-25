import { Router } from 'express';
import { getMyReport, getStudentReport } from '../controllers/reportController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const reportRoutes = Router();

reportRoutes.get('/me', requireAuth, requireRole('student'), getMyReport);
reportRoutes.get('/student/:studentId', requireAuth, requireRole('parent'), getStudentReport);
