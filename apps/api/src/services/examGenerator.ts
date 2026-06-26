import type { GeneratedExamPaper, GeneratedQuestion } from '@gcse-hub/types';
import { generateMixedMathsQuestions } from './mathsGenerators.js';

function createExamId() {
  return `exam-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getQuestionCount(durationMinutes: number) {
  if (durationMinutes <= 30) return 8;
  if (durationMinutes <= 45) return 12;
  if (durationMinutes <= 60) return 16;
  return 22;
}

function buildTopicBreakdown(questions: GeneratedQuestion[]) {
  return questions.reduce<Record<string, number>>((breakdown, question) => {
    breakdown[question.topic] = (breakdown[question.topic] ?? 0) + 1;
    return breakdown;
  }, {});
}

export function generateMathsExamPaper(year = 8, durationMinutes = 60): GeneratedExamPaper {
  const safeDuration = [30, 45, 60, 90].includes(durationMinutes) ? durationMinutes : 60;
  const questionCount = getQuestionCount(safeDuration);
  const questions = generateMixedMathsQuestions(year, questionCount).map((question, index) => ({
    ...question,
    id: `${question.id}-q${index + 1}`,
  }));

  const totalMarks = questions.reduce((sum, question) => sum + question.marks, 0);
  const estimatedSeconds = questions.reduce((sum, question) => sum + question.estimatedSeconds, 0);

  return {
    id: createExamId(),
    title: `Year ${year} Maths Exam-Style Practice Paper (${safeDuration} minutes)`,
    subject: 'Mathematics',
    year,
    durationMinutes: safeDuration,
    totalMarks,
    estimatedSeconds,
    questions,
    topicBreakdown: buildTopicBreakdown(questions),
    createdAt: new Date().toISOString(),
  };
}
