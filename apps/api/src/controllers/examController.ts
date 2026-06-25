import type { Request, Response } from 'express';
import { z } from 'zod';
import { generateMathsExamPaper } from '../services/examGenerator.js';

const generateExamQuerySchema = z.object({
  year: z.coerce.number().min(7).max(11).default(8),
  durationMinutes: z.coerce.number().refine((value) => [30, 45, 60].includes(value), {
    message: 'durationMinutes must be 30, 45 or 60',
  }).default(60),
});

export async function generateExam(req: Request, res: Response) {
  const query = generateExamQuerySchema.parse(req.query);
  const exam = generateMathsExamPaper(query.year, query.durationMinutes);

  return res.json({
    success: true,
    data: exam,
  });
}
