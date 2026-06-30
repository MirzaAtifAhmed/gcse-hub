import type { GeneratedQuestion } from '@gcse-hub/types';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { buildTutorHint } from '../services/tutorService.js';

const hintSchema = z.object({
  question: z.any(),
  submittedAnswer: z.string().optional().default(''),
});

export async function getTutorHint(req: Request, res: Response) {
  const body = hintSchema.parse(req.body);
  const question = body.question as GeneratedQuestion;

  return res.json({
    success: true,
    data: buildTutorHint(question, body.submittedAnswer),
  });
}
