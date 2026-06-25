import { Router } from 'express';
import { listSkills, listSubjects, listTopics } from '../controllers/curriculumController.js';
import { requireAuth } from '../middleware/auth.js';
export const curriculumRoutes = Router();
curriculumRoutes.get('/subjects', requireAuth, listSubjects);
curriculumRoutes.get('/topics', requireAuth, listTopics);
curriculumRoutes.get('/skills', requireAuth, listSkills);
