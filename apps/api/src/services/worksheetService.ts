import type { GeneratedExamPaper, WorksheetPack } from '@gcse-hub/types';
import { generateMixedMathsQuestions } from './mathsGenerators.js';

function titleCase(value: string) {
  return value === 'all' ? 'Mixed Maths' : value;
}

export function buildWorksheetPack(params: { year: number; topic?: string; count: number; format?: 'worksheet' | 'mark-scheme' | 'both' }): WorksheetPack {
  const topic = params.topic && params.topic !== 'all' ? params.topic : 'Mixed topics';
  const questions = generateMixedMathsQuestions(params.year, params.count)
    .filter((question) => topic === 'Mixed topics' || question.topic.toLowerCase() === topic.toLowerCase())
    .slice(0, params.count);
  const finalQuestions = questions.length >= params.count ? questions : generateMixedMathsQuestions(params.year, params.count).slice(0, params.count);

  return {
    id: `worksheet-${Date.now()}`,
    title: `Year ${params.year} ${titleCase(topic)} worksheet`,
    subject: 'Mathematics',
    year: params.year,
    topic,
    format: params.format ?? 'both',
    questions: finalQuestions.map((question, index) => ({ number: index + 1, question })),
    totalMarks: finalQuestions.reduce((sum, question) => sum + question.marks, 0),
    estimatedMinutes: Math.ceil(finalQuestions.reduce((sum, question) => sum + question.estimatedSeconds, 0) / 60),
    generatedAt: new Date().toISOString(),
  };
}

export function buildCustomPaper(params: { year: number; durationMinutes: number; topics: string[]; count?: number }): GeneratedExamPaper {
  const questionCount = params.count ?? Math.max(8, Math.round(params.durationMinutes / 4));
  const questions = generateMixedMathsQuestions(params.year, questionCount * 2)
    .filter((question) => params.topics.length === 0 || params.topics.includes('all') || params.topics.some((topic) => question.topic.toLowerCase() === topic.toLowerCase()))
    .slice(0, questionCount);
  const finalQuestions = questions.length >= questionCount ? questions : generateMixedMathsQuestions(params.year, questionCount).slice(0, questionCount);

  return {
    id: `custom-paper-${Date.now()}`,
    title: `Year ${params.year} custom paper (${params.durationMinutes} minutes)`,
    subject: 'Mathematics',
    year: params.year,
    durationMinutes: params.durationMinutes,
    totalMarks: finalQuestions.reduce((sum, question) => sum + question.marks, 0),
    estimatedSeconds: finalQuestions.reduce((sum, question) => sum + question.estimatedSeconds, 0),
    questions: finalQuestions,
    topicBreakdown: finalQuestions.reduce<Record<string, number>>((acc, question) => {
      acc[question.topic] = (acc[question.topic] ?? 0) + 1;
      return acc;
    }, {}),
    createdAt: new Date().toISOString(),
  };
}
