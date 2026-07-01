import { Router } from 'express';
import { getTeacherWorkspace } from '../controllers/teacherWorkspaceController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const teacherWorkspaceRoutes = Router();

teacherWorkspaceRoutes.get('/', requireAuth, requireRole('admin'), getTeacherWorkspace);
