import { Router } from 'express';
import { getDiagnostics } from '../controllers/diagnosticsController.js';

export const diagnosticsRoutes = Router();

diagnosticsRoutes.get('/', getDiagnostics);
