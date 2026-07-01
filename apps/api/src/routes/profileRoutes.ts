import { Router } from 'express';
import { getMyProfile, updateMyProfile } from '../controllers/profileController.js';
import { requireAuth } from '../middleware/auth.js';

export const profileRoutes = Router();

profileRoutes.use(requireAuth);
profileRoutes.get('/me', getMyProfile);
profileRoutes.patch('/me', updateMyProfile);
