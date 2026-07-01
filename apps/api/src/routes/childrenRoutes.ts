import { Router } from 'express';
import { createChild, listChildren, promoteChild, resetChildPassword } from '../controllers/childrenController.js';
import { getChildProfile, updateChildProfile } from '../controllers/profileController.js';
import { debugChildCreationReadiness } from '../controllers/childrenDebugController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const childrenRoutes = Router();

childrenRoutes.use(requireAuth, requireRole('parent'));
childrenRoutes.get('/debug/readiness', debugChildCreationReadiness);
childrenRoutes.get('/', listChildren);
childrenRoutes.post('/', createChild);
childrenRoutes.get('/:childId/profile', getChildProfile);
childrenRoutes.patch('/:childId/profile', updateChildProfile);
childrenRoutes.patch('/:childId/password', resetChildPassword);
childrenRoutes.patch('/:childId/promote', promoteChild);
