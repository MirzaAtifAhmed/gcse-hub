import { Router } from 'express';
import { createChild, listChildren, promoteChild } from '../controllers/childrenController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
export const childrenRoutes = Router();
childrenRoutes.use(requireAuth, requireRole('parent'));
childrenRoutes.get('/', listChildren);
childrenRoutes.post('/', createChild);
childrenRoutes.patch('/:childId/promote', promoteChild);
