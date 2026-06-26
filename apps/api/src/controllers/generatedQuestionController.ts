import type { GeneratedQuestion } from '@gcse-hub/types';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { generateMixedMathsQuestions } from '../services/mathsGenerators.js';

const generatedPracticeQuerySchema = z.object({
  year: z.coerce.number().min(7).max(11).default(8),
  count: z.coerce.number().min(1).max(30).default(10),
  topic: z.string().optional(),
});

export async function getGeneratedPracticeQuestions(req: Request, res: Response) {
  const query = generatedPracticeQuerySchema.parse(req.query);
  let questions: GeneratedQuestion[] = [];

  let guard = 0;
  while (questions.length < query.count && guard < query.count * 10) {
    const batch = generateMixedMathsQuestions(query.year, query.count);
    const filtered = query.topic
      ? batch.filter((question) => question.topic.toLowerCase() === query.topic?.toLowerCase())
      : batch;
    questions = [...questions, ...filtered];
    guard += batch.length;
  }

  return res.json({
    success: true,
    data: questions.slice(0, query.count),
  });
}
