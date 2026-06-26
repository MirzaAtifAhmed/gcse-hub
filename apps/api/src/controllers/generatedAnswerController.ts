import type { GeneratedQuestion } from '@gcse-hub/types';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { markShortAnswer } from '../services/markingService.js';
import { recordTopicMastery } from '../services/masteryService.js';

const schema = z.object({
  question: z.any(),
  answer: z.string().min(1),
});

export async function submitGeneratedAnswer(req: Request, res: Response) {
  const body = schema.parse(req.body);
  const question = body.question as GeneratedQuestion;
  const result = markShortAnswer(body.answer, question.answer, question.marks);

  if (req.user?.id) {
    await recordTopicMastery({
      studentId: req.user.id,
      topic: question.topic,
      isCorrect: result.isCorrect,
      awardedMarks: result.awardedMarks,
      totalMarks: question.marks,
    });
  }

  return res.json({
    success: true,
    data: {
      questionId: question.id,
      submittedAnswer: body.answer,
      correctAnswer: question.answer,
      isCorrect: result.isCorrect,
      awardedMarks: result.awardedMarks,
      totalMarks: question.marks,
      solution: question.solution,
      checkedAt: new Date().toISOString(),
    },
  });
}
