import type { Request, Response } from 'express';
import { z } from 'zod';
import { generateMixedMathsQuestions } from '../services/mathsGenerators.js';

const generatedPracticeQuerySchema = z.object({
  year: z.coerce.number().min(7).max(11).default(8),
  count: z.coerce.number().min(1).max(30).default(10),
});

export async function getGeneratedPracticeQuestions(req: Request, res: Response) {
  const query = generatedPracticeQuerySchema.parse(req.query);
  const questions = generateMixedMathsQuestions(query.year, query.count);

  return res.json({
    success: true,
    data: questions,
  });
}
