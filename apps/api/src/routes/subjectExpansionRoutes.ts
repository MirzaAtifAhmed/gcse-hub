import { Router } from 'express';
import { getSubjectExpansionStatus, getSubjectStarterPractice } from '../controllers/subjectExpansionController.js';
import { requireAuth } from '../middleware/auth.js';

export const subjectExpansionRoutes = Router();

subjectExpansionRoutes.get('/', requireAuth, getSubjectExpansionStatus);
subjectExpansionRoutes.get('/starter-practice', requireAuth, getSubjectStarterPractice);
