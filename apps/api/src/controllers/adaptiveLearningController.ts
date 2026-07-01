import type { Request, Response } from 'express';
import { z } from 'zod';
import { buildAdaptiveMasteryDashboard } from '../services/adaptiveMasteryService.js';

const querySchema = z.object({
  year: z.coerce.number().min(7).max(11).optional(),
});

export async function getAdaptiveLearningDashboard(req: Request, res: Response) {
  if (!req.user?.id) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const query = querySchema.parse(req.query);
  const dashboard = await buildAdaptiveMasteryDashboard(req.user.id, query.year);

  return res.json({
    success: true,
    data: dashboard,
  });
}
