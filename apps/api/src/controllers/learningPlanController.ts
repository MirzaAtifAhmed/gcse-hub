import type { Request, Response } from 'express';
import { z } from 'zod';
import { User } from '../models/User.js';
import { buildLearningPlan } from '../services/learningPlanService.js';

const querySchema = z.object({
  year: z.coerce.number().min(7).max(11).optional(),
});

export async function getMyLearningPlan(req: Request, res: Response) {
  if (!req.user?.id) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const query = querySchema.parse(req.query);
  const user = await User.findById(req.user.id).select('currentYear');
  const year = query.year ?? user?.currentYear ?? 8;
  const plan = await buildLearningPlan(req.user.id, year);

  return res.json({ success: true, data: plan });
}
