import type { Request, Response } from 'express';
import { buildParentInsight, buildStudentInsight } from '../services/insightService.js';

export async function getMyInsight(req: Request, res: Response) {
  if (!req.user?.id) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const data = await buildStudentInsight(req.user.id);
  return res.json({ success: true, data });
}

export async function getParentInsight(req: Request, res: Response) {
  if (!req.user?.id) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const data = await buildParentInsight(req.user.id);
  return res.json({ success: true, data });
}
