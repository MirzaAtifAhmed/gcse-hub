import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { ZodError } from 'zod';
import { env } from './config/env.js';
import { authRoutes } from './routes/authRoutes.js';
import { dashboardRoutes } from './routes/dashboardRoutes.js';
export const app = express();
app.use(helmet());
app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'GCSE Hub API is running' });
});
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use((err, _req, res, _next) => {
    if (err instanceof ZodError) {
        return res
            .status(400)
            .json({ success: false, message: 'Validation error', errors: err.flatten() });
    }
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
});
