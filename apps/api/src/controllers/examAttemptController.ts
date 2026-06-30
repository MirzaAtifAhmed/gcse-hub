import type { GeneratedExamPaper } from '@gcse-hub/types';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { ExamAttempt } from '../models/ExamAttempt.js';
import { markShortAnswer } from '../services/markingService.js';
import { recordTopicMastery } from '../services/masteryService.js';

const startSchema = z.object({ paper: z.any() });
const answerSchema = z.object({ answer: z.string().default('') });

function toDto(attempt: any) {
  return {
    id: attempt._id.toString(),
    studentId: attempt.studentId.toString(),
    paper: attempt.paper,
    answers: attempt.answers,
    status: attempt.status,
    startedAt: attempt.createdAt?.toISOString() ?? new Date().toISOString(),
    submittedAt: attempt.submittedAt?.toISOString(),
    totalMarks: attempt.totalMarks ?? 0,
    awardedMarks: attempt.awardedMarks ?? 0,
    percentage: attempt.percentage ?? 0,
  };
}

export async function startExamAttempt(req: Request, res: Response) {
  const body = startSchema.parse(req.body);
  const paper = body.paper as GeneratedExamPaper;

  const attempt = await ExamAttempt.create({
    studentId: req.user?.id,
    paper,
    answers: paper.questions.map((question) => ({
      questionId: question.id,
      answer: '',
      totalMarks: question.marks,
    })),
    status: 'in-progress',
    totalMarks: paper.totalMarks,
  });

  return res.status(201).json({ success: true, data: toDto(attempt) });
}

export async function saveExamAnswer(req: Request, res: Response) {
  const body = answerSchema.parse(req.body);
  const attempt = await ExamAttempt.findOne({ _id: req.params.attemptId, studentId: req.user?.id });

  if (!attempt) return res.status(404).json({ success: false, message: 'Attempt not found' });
  if (attempt.status === 'submitted') return res.status(400).json({ success: false, message: 'Already submitted' });

  const answer = attempt.answers.find((item) => item.questionId === req.params.questionId);
  if (!answer) return res.status(404).json({ success: false, message: 'Question not found' });

  answer.answer = body.answer;
  await attempt.save();

  return res.json({ success: true, data: toDto(attempt) });
}

export async function submitExamAttempt(req: Request, res: Response) {
  const attempt = await ExamAttempt.findOne({ _id: req.params.attemptId, studentId: req.user?.id });
  if (!attempt) return res.status(404).json({ success: false, message: 'Attempt not found' });

  const paper = attempt.paper as GeneratedExamPaper;
  const questionMap = new Map(paper.questions.map((question) => [question.id, question]));

  let awardedMarks = 0;

  for (const answer of attempt.answers) {
    const question = questionMap.get(answer.questionId);
    if (!question) continue;

    const result = markShortAnswer(answer.answer, question.answer, question.marks);
    answer.isCorrect = result.isCorrect;
    answer.awardedMarks = result.awardedMarks;
    answer.totalMarks = question.marks;
    awardedMarks += result.awardedMarks;

    if (req.user?.id && question.topic) {
      await recordTopicMastery({
        studentId: req.user.id,
        topic: question.topic,
        isCorrect: result.isCorrect,
        awardedMarks: result.awardedMarks,
        totalMarks: question.marks,
      });
    }
  }

  attempt.status = 'submitted';
  attempt.submittedAt = new Date();
  attempt.awardedMarks = awardedMarks;
  attempt.totalMarks = paper.totalMarks;
  attempt.percentage = paper.totalMarks ? Math.round((awardedMarks / paper.totalMarks) * 100) : 0;

  await attempt.save();

  return res.json({ success: true, data: toDto(attempt) });
}
