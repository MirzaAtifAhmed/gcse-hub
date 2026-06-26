import type { Request, Response } from 'express';
import { z } from 'zod';
import { buildLearningPlan } from '../services/learningPlanService.js';
import { User } from '../models/User.js';

const querySchema = z.object({
  year: z.coerce.number().min(7).max(11).optional(),
});

export async function getMyLearningPlan(req: Request, res: Response) {
  const query = querySchema.parse(req.query);
  const user = await User.findById(req.user?.id||0);

if (!user) {
  return res.status(404).json({
    success: false,
    message: 'User not found',
  });
}

const year = user.currentYear ?? 8;
  const plan = await buildLearningPlan(String(req.user?.id), year);

  return res.json({ success: true, data: plan });
}
