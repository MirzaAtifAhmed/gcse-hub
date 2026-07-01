import type { Request, Response } from 'express';
import { z } from 'zod';
import { buildDiagnosticQuestions, buildLearningPath, markDiagnosticAssessment } from '../services/diagnosticAssessmentService.js';
import { User } from '../models/User.js';

const startSchema = z.object({
  year: z.coerce.number().min(7).max(11).default(8),
  count: z.coerce.number().min(8).max(30).default(20),
});

const submitSchema = z.object({
  year: z.coerce.number().min(7).max(11).default(8),
  questions: z.array(z.any()).min(1),
  answers: z.array(z.object({
    questionId: z.string(),
    answer: z.string().default(''),
    confidence: z.enum(['low', 'medium', 'high']).optional(),
  })),
});

export async function startDiagnosticAssessment(req: Request, res: Response) {
  const query = startSchema.parse(req.query);
  const questions = buildDiagnosticQuestions(query.year, query.count);
  return res.json({ success: true, data: { questions, estimatedMinutes: Math.ceil(questions.reduce((sum, question) => sum + question.estimatedSeconds, 0) / 60) } });
}

export async function submitDiagnosticAssessment(req: Request, res: Response) {
  const body = submitSchema.parse(req.body);
  const result = markDiagnosticAssessment({
    studentId: req.user?.id ?? 'anonymous',
    year: body.year,
    questions: body.questions,
    answers: body.answers,
  });

  if (req.user?.id) {
    await User.findByIdAndUpdate(req.user.id, {
      currentYear: body.year,
      currentLevel: result.currentLevel,
      target: result.suggestedTarget,
      targetGrade: Math.max(result.estimatedGrade + 1, 4),
    });
  }

  return res.json({ success: true, data: { result, learningPath: buildLearningPath(result) } });
}
