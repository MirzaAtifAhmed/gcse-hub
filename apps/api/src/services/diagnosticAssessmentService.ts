import type { DiagnosticAnswerInput, DiagnosticAssessmentSummary, GeneratedQuestion, LearningPathStep } from '@gcse-hub/types';
import { isAnswerCorrect } from '@gcse-hub/shared';
import { generateMixedMathsQuestions } from './mathsGenerators.js';

const TOPIC_WEIGHT: Record<string, number> = {
  Algebra: 1.25,
  Angles: 1,
  Area: 0.95,
  Probability: 0.9,
  'Ratio and Proportion': 1.15,
  'Fractions, Decimals and Percentages': 1,
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

export function buildDiagnosticQuestions(year = 8, count = 20): GeneratedQuestion[] {
  const base = generateMixedMathsQuestions(clamp(year, 7, 11), Math.max(20, count * 2));
  const byTopic = new Map<string, GeneratedQuestion>();

  for (const question of base) {
    if (!byTopic.has(question.topic)) {
      byTopic.set(question.topic, question);
    }
  }

  const balanced = [...byTopic.values(), ...base].slice(0, count);
  return balanced.map((question, index) => ({
    ...question,
    id: `diagnostic-${Date.now()}-${index + 1}`,
    title: `Diagnostic ${index + 1}: ${question.title}`,
    tags: [...question.tags, 'diagnostic'],
  }));
}

export function markDiagnosticAssessment(params: {
  studentId: string;
  year: number;
  questions: GeneratedQuestion[];
  answers: DiagnosticAnswerInput[];
}): DiagnosticAssessmentSummary {
  const answerMap = new Map(params.answers.map((answer) => [answer.questionId, answer]));
  const topicScores = new Map<string, { correct: number; total: number; weighted: number }>();
  let weightedCorrect = 0;
  let weightedTotal = 0;

  for (const question of params.questions) {
    const submitted = answerMap.get(question.id);
    const correct = submitted ? isAnswerCorrect(submitted.answer, question.answer) : false;
    const confidenceMultiplier = submitted?.confidence === 'high' ? 1.05 : submitted?.confidence === 'low' ? 0.9 : 1;
    const topicMultiplier = TOPIC_WEIGHT[question.topic] ?? 1;
    const weight = question.difficulty * topicMultiplier * confidenceMultiplier;

    weightedTotal += weight;
    if (correct) weightedCorrect += weight;

    const current = topicScores.get(question.topic) ?? { correct: 0, total: 0, weighted: 0 };
    current.total += 1;
    current.weighted += correct ? weight : 0;
    if (correct) current.correct += 1;
    topicScores.set(question.topic, current);
  }

  const percentage = weightedTotal ? (weightedCorrect / weightedTotal) * 100 : 0;
  const estimatedGrade = clamp(Math.round(percentage / 12) + 1, 1, 9);
  const currentLevel = clamp(params.year + Math.round((percentage - 55) / 22), 7, 11);
  const sortedTopics = [...topicScores.entries()].sort((a, b) => (b[1].correct / b[1].total) - (a[1].correct / a[1].total));
  const strengths = sortedTopics.filter(([, score]) => score.correct / score.total >= 0.7).map(([topic]) => topic).slice(0, 4);
  const weaknesses = sortedTopics.filter(([, score]) => score.correct / score.total < 0.7).map(([topic]) => topic).slice(0, 5);

  return {
    id: `diagnostic-result-${Date.now()}`,
    studentId: params.studentId,
    year: params.year,
    estimatedGrade,
    currentLevel,
    suggestedTarget: estimatedGrade >= 5 ? 'higher' : 'foundation',
    strengths: unique(strengths),
    weaknesses: unique(weaknesses),
    recommendations: buildRecommendations(weaknesses, estimatedGrade),
    questions: params.questions,
    createdAt: new Date().toISOString(),
  };
}

export function buildLearningPath(summary: Pick<DiagnosticAssessmentSummary, 'weaknesses' | 'currentLevel' | 'estimatedGrade'>): LearningPathStep[] {
  const topics = summary.weaknesses.length ? summary.weaknesses : ['Fractions, Decimals and Percentages', 'Algebra', 'Ratio and Proportion'];
  return topics.flatMap((topic, index) => [
    {
      id: `path-${index}-learn`,
      title: `Learn the key method for ${topic}`,
      topic,
      skill: 'Core method',
      estimatedMinutes: 12,
      status: 'not-started' as const,
      recommendedMode: 'learn' as const,
    },
    {
      id: `path-${index}-practice`,
      title: `Practise ${topic} at your level`,
      topic,
      skill: `Year ${summary.currentLevel} practice`,
      estimatedMinutes: 20,
      status: 'not-started' as const,
      recommendedMode: 'practice' as const,
    },
    {
      id: `path-${index}-test`,
      title: `Mini test: ${topic}`,
      topic,
      skill: `Grade ${summary.estimatedGrade + 1} target`,
      estimatedMinutes: 15,
      status: 'not-started' as const,
      recommendedMode: 'test' as const,
    },
  ]);
}

function buildRecommendations(weaknesses: string[], grade: number) {
  const first = weaknesses[0] ?? 'Algebra';
  const second = weaknesses[1] ?? 'Fractions, Decimals and Percentages';
  return [
    `Start with ${first} before moving to mixed practice.`,
    `Use worked examples for ${second} and then try a 10-question topic test.`,
    grade < 5 ? 'Focus on accuracy and core Foundation skills first.' : 'Introduce GCSE exam-style questions twice per week.',
  ];
}
