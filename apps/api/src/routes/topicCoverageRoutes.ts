import { Router } from 'express';
import { getTopicCoverage } from '../controllers/topicCoverageController.js';
import { requireAuth } from '../middleware/auth.js';

export const topicCoverageRoutes = Router();

topicCoverageRoutes.get('/', requireAuth, getTopicCoverage);
