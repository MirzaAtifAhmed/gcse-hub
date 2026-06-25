import type { Request, Response } from 'express';
import { z } from 'zod';
import { CurriculumSkill } from '../models/CurriculumSkill.js';
import { CurriculumTopic } from '../models/CurriculumTopic.js';
import { PracticeAttempt } from '../models/PracticeAttempt.js';
import { QuestionTemplate } from '../models/QuestionTemplate.js';
import { Subject } from '../models/Subject.js';
import { markShortAnswer } from '../services/markingService.js';
import { toQuestionTemplateDto } from '../utils/mappers.js';

const practiceQuerySchema = z.object({
  subjectSlug: z.string().default('mathematics'),
  year: z.coerce.number().min(7).max(11).default(8),
  limit: z.coerce.number().min(1).max(20).default(10),
});

const answerSchema = z.object({
  answer: z.string().min(1),
  timeTakenSeconds: z.number().min(0).optional(),
});

export async function listPracticeQuestions(req: Request, res: Response) {
  const query = practiceQuerySchema.parse(req.query);

  const subject = await Subject.findOne({ slug: query.subjectSlug, isActive: true });
  if (!subject) {
    return res.status(404).json({ success: false, message: 'Subject not found' });
  }

  const topics = await CurriculumTopic.find({ subjectId: subject._id, years: query.year }).select('_id');
  const topicIds = topics.map((topic) => topic._id);

  const skills = await CurriculumSkill.find({ topicId: { $in: topicIds }, years: query.year }).select('_id');
  const skillIds = skills.map((skill) => skill._id);

  const questions = await QuestionTemplate.find({
    subjectId: subject._id,
    topicId: { $in: topicIds },
    skillId: { $in: skillIds },
    year: query.year,
    isActive: true,
  })
    .sort({ difficulty: 1, title: 1 })
    .limit(query.limit);

  return res.json({ success: true, data: questions.map(toQuestionTemplateDto) });
}

export async function submitPracticeAnswer(req: Request, res: Response) {
  const body = answerSchema.parse(req.body);
  const question = await QuestionTemplate.findById(req.params.questionId);

  if (!question) {
    return res.status(404).json({ success: false, message: 'Question not found' });
  }

  const result = markShortAnswer(body.answer, question.answer, question.marks);

  const attempt = await PracticeAttempt.create({
    studentId: req.user?.id,
    questionTemplateId: question._id,
    submittedAnswer: body.answer,
    correctAnswer: question.answer,
    isCorrect: result.isCorrect,
    awardedMarks: result.awardedMarks,
    totalMarks: question.marks,
    timeTakenSeconds: body.timeTakenSeconds,
  });

  return res.status(201).json({
    success: true,
    data: {
      questionId: question._id.toString(),
      submittedAnswer: attempt.submittedAnswer,
      correctAnswer: question.answer,
      isCorrect: result.isCorrect,
      awardedMarks: result.awardedMarks,
      totalMarks: question.marks,
      solution: {
        finalAnswer: question.solution.finalAnswer,
        steps: question.solution.steps,
        markScheme: question.solution.markScheme,
        commonMistakes: question.solution.commonMistakes ?? [],
      },
      checkedAt: attempt.createdAt?.toISOString() ?? new Date().toISOString(),
    },
  });
}
