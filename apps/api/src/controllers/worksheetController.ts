import type { Request, Response } from 'express';
import { z } from 'zod';
import { buildCustomPaper, buildWorksheetPack } from '../services/worksheetService.js';

const worksheetSchema = z.object({
  year: z.coerce.number().min(7).max(11).default(8),
  topic: z.string().default('all'),
  count: z.coerce.number().min(5).max(60).default(20),
  format: z.enum(['worksheet', 'mark-scheme', 'both']).default('both'),
});

const paperSchema = z.object({
  year: z.coerce.number().min(7).max(11).default(8),
  durationMinutes: z.coerce.number().min(15).max(120).default(45),
  topics: z.string().default('all'),
  count: z.coerce.number().min(5).max(40).optional(),
});

export async function generateWorksheet(req: Request, res: Response) {
  const query = worksheetSchema.parse(req.query);
  return res.json({ success: true, data: buildWorksheetPack(query) });
}

export async function generateCustomPaper(req: Request, res: Response) {
  const query = paperSchema.parse(req.query);
  return res.json({ success: true, data: buildCustomPaper({ ...query, topics: query.topics.split(',').map((topic) => topic.trim()).filter(Boolean) }) });
}
