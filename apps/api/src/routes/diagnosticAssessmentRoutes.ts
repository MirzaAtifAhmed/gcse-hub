import { Router } from 'express';
import { startDiagnosticAssessment, submitDiagnosticAssessment } from '../controllers/diagnosticAssessmentController.js';
import { requireAuth } from '../middleware/auth.js';

export const diagnosticAssessmentRoutes = Router();

diagnosticAssessmentRoutes.get('/start', requireAuth, startDiagnosticAssessment);
diagnosticAssessmentRoutes.post('/submit', requireAuth, submitDiagnosticAssessment);
