import type { Request, Response } from 'express';
import { z } from 'zod';
import { getSubjectLaunchSummaries, getSubjectStarterQuestions } from '../services/subjectExpansionService.js';

const questionsQuery = z.object({
  subject: z.string().default('english'),
  year: z.coerce.number().min(7).max(11).default(8),
});

export async function getSubjectExpansionStatus(_req: Request, res: Response) {
  return res.json({ success: true, data: getSubjectLaunchSummaries() });
}

export async function getSubjectStarterPractice(req: Request, res: Response) {
  const query = questionsQuery.parse(req.query);
  return res.json({ success: true, data: getSubjectStarterQuestions(query.subject, query.year) });
}
