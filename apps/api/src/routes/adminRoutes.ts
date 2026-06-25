import { Router } from 'express';
import { getAccountsOverview } from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const adminRoutes = Router();

adminRoutes.use(requireAuth, requireRole('admin'));
adminRoutes.get('/accounts', getAccountsOverview);
