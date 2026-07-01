import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import morgan from 'morgan';
import { ZodError } from 'zod';
import { env } from './config/env.js';
import { openApiDocument } from './docs/openApi.js';
import { simpleRateLimit } from './middleware/rateLimit.js';
import { logger } from './utils/logger.js';
import { adminRoutes } from './routes/adminRoutes.js';
import { adaptiveLearningRoutes } from './routes/adaptiveLearningRoutes.js';
import { authRoutes } from './routes/authRoutes.js';
import { childrenRoutes } from './routes/childrenRoutes.js';
import { curriculumRoutes } from './routes/curriculumRoutes.js';
import { dashboardRoutes } from './routes/dashboardRoutes.js';
import { diagnosticAssessmentRoutes } from './routes/diagnosticAssessmentRoutes.js';
import { subjectExpansionRoutes } from './routes/subjectExpansionRoutes.js';
import { teacherWorkspaceRoutes } from './routes/teacherWorkspaceRoutes.js';
import { worksheetRoutes } from './routes/worksheetRoutes.js';

import { examRoutes } from './routes/examRoutes.js';
import { insightRoutes } from './routes/insightRoutes.js';
import { learningPlanRoutes } from './routes/learningPlanRoutes.js';
import { masteryRoutes } from './routes/masteryRoutes.js';
import { profileRoutes } from './routes/profileRoutes.js';
import { questionRoutes } from './routes/questionRoutes.js';
import { reportRoutes } from './routes/reportRoutes.js';
import { revisionPlannerRoutes } from './routes/revisionPlannerRoutes.js';
import { topicCoverageRoutes } from './routes/topicCoverageRoutes.js';
import { tutorRoutes } from './routes/tutorRoutes.js';

export const app = express();

app.set('trust proxy', 1);

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(simpleRateLimit({ windowMs: 60_000, max: env.NODE_ENV === 'production' ? 120 : 500 }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

function getDatabaseState() {
  const databaseStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return databaseStates[mongoose.connection.readyState] ?? 'unknown';
}

app.get('/api/health', (_req, res) => {
  const databaseState = getDatabaseState();

  res.status(databaseState === 'connected' ? 200 : 503).json({
    success: databaseState === 'connected',
    status: databaseState === 'connected' ? 'ok' : 'degraded',
    service: 'gcse-hub-api',
    version: process.env.npm_package_version ?? '1.0.0',
    environment: env.NODE_ENV,
    database: databaseState,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health/mongo', async (_req, res) => {
  const databaseState = getDatabaseState();

  try {
    if (!mongoose.connection.db) {
      return res.status(503).json({
        success: false,
        status: 'degraded',
        service: 'gcse-hub-api',
        database: databaseState,
        mongoPing: false,
        message: 'MongoDB connection has not been established yet.',
        timestamp: new Date().toISOString(),
      });
    }

    await mongoose.connection.db.admin().ping();

    return res.json({
      success: true,
      status: 'ok',
      service: 'gcse-hub-api',
      database: databaseState,
      mongoPing: true,
      databaseName: mongoose.connection.name,
      host: mongoose.connection.host,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('MongoDB health check failed', error);

    return res.status(503).json({
      success: false,
      status: 'degraded',
      service: 'gcse-hub-api',
      database: databaseState,
      mongoPing: false,
      message: error instanceof Error ? error.message : 'MongoDB ping failed',
      timestamp: new Date().toISOString(),
    });
  }
});

app.get('/api/docs', (_req, res) => {
  res.json(openApiDocument);
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/children', childrenRoutes);
app.use('/api/curriculum', curriculumRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/revision-planner', revisionPlannerRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/topic-coverage', topicCoverageRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/mastery', masteryRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/learning-plan', learningPlanRoutes);
app.use('/api/adaptive-learning', adaptiveLearningRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/diagnostic-assessment', diagnosticAssessmentRoutes);
app.use('/api/teacher-workspace', teacherWorkspaceRoutes);
app.use('/api/worksheets', worksheetRoutes);
app.use('/api/subject-expansion', subjectExpansionRoutes);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ success: false, message: 'Validation error', errors: err.flatten() });
  }

  logger.error('Unhandled API error', err);

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(env.NODE_ENV !== 'production' && err instanceof Error ? { error: err.message, stack: err.stack } : {}),
  });
});
