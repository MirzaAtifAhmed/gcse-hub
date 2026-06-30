import type { Request, Response } from 'express';
import { z } from 'zod';
import { generateIntelligentPractice } from '../services/intelligentPracticeService.js';

const querySchema = z.object({
  year: z.coerce.number().min(7).max(11).default(8),
  count: z.coerce.number().min(1).max(50).default(10),
  topic: z.string().optional(),
  skill: z.string().optional(),
  difficulty: z.union([z.coerce.number().min(1).max(5), z.enum(['adaptive', 'all'])]).optional(),
  questionType: z.enum(['all', 'short-answer', 'multiple-choice', 'worked', 'diagram', 'multi-part', 'explain', 'long-answer']).default('all'),
  questionStyle: z.enum(['all', 'standard', 'gcse-exam-style', 'real-world', 'challenge', 'speed-practice', 'mixed']).default('all'),
  mode: z.enum(['practice', 'topic-test', 'timed-test', 'mastery', 'exam-mode', 'daily-challenge']).default('practice'),
});

export async function getIntelligentPractice(req: Request, res: Response) {
  const query = querySchema.parse(req.query);
  const result = generateIntelligentPractice(query as Parameters<typeof generateIntelligentPractice>[0]);

  return res.json({
    success: true,
    data: result,
  });
}

export async function getPracticeBuilderOptions(_req: Request, res: Response) {
  return res.json({
    success: true,
    data: {
      topics: [
        { value: 'all', label: 'Mixed topics' },
        { value: 'Fractions, Decimals and Percentages', label: 'Fractions, decimals and percentages' },
        { value: 'Algebra', label: 'Algebra' },
        { value: 'Ratio and Proportion', label: 'Ratio and proportion' },
        { value: 'Area', label: 'Area and measures' },
        { value: 'Angles', label: 'Angles and geometry' },
        { value: 'Probability', label: 'Probability' },
        { value: 'Measures', label: 'Measures, speed and units' },
        { value: 'Number', label: 'Number and bounds' },
      ],
      difficulties: [
        { value: 'adaptive', label: 'Adaptive' },
        { value: 'all', label: 'All difficulties' },
        { value: '1', label: 'Easy' },
        { value: '2', label: 'Easy-medium' },
        { value: '3', label: 'Medium' },
        { value: '4', label: 'Hard' },
        { value: '5', label: 'GCSE challenge' },
      ],
      questionTypes: [
        { value: 'all', label: 'All question types' },
        { value: 'short-answer', label: 'Short answer' },
        { value: 'multiple-choice', label: 'Multiple choice' },
        { value: 'worked', label: 'Worked response' },
        { value: 'diagram', label: 'Diagram questions' },
        { value: 'multi-part', label: 'Multi-part questions' },
        { value: 'explain', label: 'Explain questions' },
        { value: 'long-answer', label: 'Long answer' },
      ],
      questionStyles: [
        { value: 'all', label: 'All styles' },
        { value: 'standard', label: 'Standard practice' },
        { value: 'gcse-exam-style', label: 'GCSE exam style' },
        { value: 'real-world', label: 'Real world' },
        { value: 'challenge', label: 'Challenge' },
        { value: 'speed-practice', label: 'Speed practice' },
        { value: 'mixed', label: 'Mixed' },
      ],
      modes: [
        { value: 'practice', label: 'Practice' },
        { value: 'topic-test', label: 'Topic test' },
        { value: 'timed-test', label: 'Timed test' },
        { value: 'mastery', label: 'Mastery mode' },
        { value: 'exam-mode', label: 'Exam mode' },
        { value: 'daily-challenge', label: 'Daily challenge' },
      ],
    },
  });
}
