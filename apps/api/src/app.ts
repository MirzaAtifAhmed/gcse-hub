import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { ZodError } from 'zod';
import { env } from './config/env.js';
import { adminRoutes } from './routes/adminRoutes.js';
import { authRoutes } from './routes/authRoutes.js';
import { childrenRoutes } from './routes/childrenRoutes.js';
import { curriculumRoutes } from './routes/curriculumRoutes.js';
import { dashboardRoutes } from './routes/dashboardRoutes.js';
import { examRoutes } from './routes/examRoutes.js';
import { questionRoutes } from './routes/questionRoutes.js';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'GCSE Hub API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/children', childrenRoutes);
app.use('/api/curriculum', curriculumRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/admin', adminRoutes);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof ZodError) {
    return res
      .status(400)
      .json({ success: false, message: 'Validation error', errors: err.flatten() });
  }

  console.error(err);
  return res.status(500).json({ success: false, message: 'Internal server error' });
});
