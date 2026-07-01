import { Router } from 'express';
import { login, logout, me, register, updatePassword } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

export const authRoutes = Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/logout', logout);
authRoutes.get('/me', requireAuth, me);
authRoutes.patch('/password', requireAuth, updatePassword);
