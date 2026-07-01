import { Router } from 'express';
import { generateCustomPaper, generateWorksheet } from '../controllers/worksheetController.js';
import { requireAuth } from '../middleware/auth.js';

export const worksheetRoutes = Router();

worksheetRoutes.get('/', requireAuth, generateWorksheet);
worksheetRoutes.get('/custom-paper', requireAuth, generateCustomPaper);
