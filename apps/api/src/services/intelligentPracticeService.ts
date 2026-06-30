import type { DifficultyLevel, GeneratedQuestion, QuestionType } from '@gcse-hub/types';
import { generateMixedMathsQuestions } from './mathsGenerators.js';

export type PracticeQuestionType = QuestionType | 'diagram' | 'multi-part' | 'explain' | 'long-answer' | 'all';
export type PracticeStyle = 'all' | 'standard' | 'gcse-exam-style' | 'real-world' | 'challenge' | 'speed-practice' | 'mixed';
export type PracticeMode = 'practice' | 'topic-test' | 'timed-test' | 'mastery' | 'exam-mode' | 'daily-challenge';

export interface IntelligentPracticeRequest {
  year: number;
  count: number;
  topic?: string;
  skill?: string;
  difficulty?: DifficultyLevel | 'adaptive' | 'all';
  questionType?: PracticeQuestionType;
  questionStyle?: PracticeStyle;
  mode?: PracticeMode;
}

export interface IntelligentPracticeResult {
  questions: GeneratedQuestion[];
  summary: {
    title: string;
    topic: string;
    skill?: string;
    year: number;
    count: number;
    estimatedMinutes: number;
    totalMarks: number;
    questionType: PracticeQuestionType;
    questionStyle: PracticeStyle;
    mode: PracticeMode;
  };
}

const TOPIC_ALIASES: Record<string, string[]> = {
  algebra: ['algebra', 'quadratics', 'equations', 'sequences', 'factorising'],
  ratio: ['ratio', 'ratio and proportion', 'proportion'],
  probability: ['probability', 'venn', 'tree'],
  fdp: ['fractions, decimals and percentages', 'fractions', 'percentages', 'decimals', 'fdp'],
  percentages: ['fractions, decimals and percentages', 'percentages'],
  area: ['area', 'geometry'],
  angles: ['angles', 'geometry'],
  geometry: ['geometry', 'area', 'angles', 'circle', 'volume', 'bearings', 'transformations', 'pythagoras'],
  measures: ['measures', 'speed', 'units', 'volume'],
  number: ['number', 'bounds', 'standard form', 'indices', 'surds'],
  statistics: ['statistics', 'mean', 'averages', 'scatter', 'frequency'],
};

function normalise(value = '') {
  return value.toLowerCase().trim();
}

function matchesTopic(question: GeneratedQuestion, topic?: string) {
  if (!topic || topic === 'all') return true;
  const wanted = normalise(topic);
  const aliases = TOPIC_ALIASES[wanted] ?? [wanted];
  const haystack = [question.topic, question.skill, ...(question.tags ?? [])].map(normalise).join(' | ');
  return aliases.some((alias) => haystack.includes(alias));
}

function matchesSkill(question: GeneratedQuestion, skill?: string) {
  if (!skill || skill === 'all') return true;
  const wanted = normalise(skill);
  return normalise(question.skill).includes(wanted) || question.tags.some((tag) => normalise(tag).includes(wanted));
}

function matchesDifficulty(question: GeneratedQuestion, difficulty?: IntelligentPracticeRequest['difficulty']) {
  if (!difficulty || difficulty === 'all' || difficulty === 'adaptive') return true;
  return question.difficulty === difficulty;
}

function matchesQuestionType(question: GeneratedQuestion, questionType: PracticeQuestionType) {
  if (questionType === 'all') return true;
  if (questionType === 'diagram') return Boolean(question.diagram && question.diagram.type !== 'none');
  if (questionType === 'multi-part') return question.marks >= 4 || question.tags.includes('multi-part');
  if (questionType === 'explain') return question.questionText.toLowerCase().includes('explain') || question.tags.includes('explain');
  if (questionType === 'long-answer') return question.marks >= 5 || question.estimatedSeconds >= 300;
  return question.type === questionType;
}

function matchesQuestionStyle(question: GeneratedQuestion, style: PracticeStyle) {
  if (style === 'all' || style === 'mixed') return true;
  if (style === 'gcse-exam-style') return Boolean(question.examStyle) || question.tags.includes('exam-style') || question.tags.includes('gcse');
  if (style === 'real-world') return question.tags.includes('real-world') || /shop|recipe|charity|coach|bike|jacket|school/i.test(question.questionText);
  if (style === 'challenge') return question.difficulty >= 4 || question.marks >= 4;
  if (style === 'speed-practice') return question.estimatedSeconds <= 120 && question.marks <= 2;
  return !question.examStyle;
}

function boostForMode(question: GeneratedQuestion, mode: PracticeMode) {
  if (mode === 'topic-test' || mode === 'timed-test') return question.examStyle ? 2 : 0;
  if (mode === 'mastery') return question.difficulty >= 3 ? 2 : 0;
  if (mode === 'exam-mode') return question.examStyle ? 3 : question.marks >= 3 ? 1 : 0;
  if (mode === 'daily-challenge') return question.difficulty >= 4 ? 3 : 0;
  return 0;
}

function targetTypeForIndex(index: number): PracticeQuestionType {
  const mix: PracticeQuestionType[] = [
    'short-answer',
    'worked',
    'multiple-choice',
    'diagram',
    'worked',
    'multi-part',
    'short-answer',
    'explain',
    'worked',
    'long-answer',
  ];
  return mix[index % mix.length];
}

function dedupe(questions: GeneratedQuestion[]) {
  const seen = new Set<string>();
  return questions.filter((question) => {
    const key = `${question.title}:${question.answer}:${question.topic}:${question.skill}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function createFallbackQuestion(year: number, topic = 'Mixed maths'): GeneratedQuestion {
  const base = generateMixedMathsQuestions(year, 1)[0];
  return {
    ...base,
    topic: topic === 'all' ? base.topic : topic,
    tags: [...new Set([...(base.tags ?? []), 'fallback-practice'])],
  };
}

export function generateIntelligentPractice(config: IntelligentPracticeRequest): IntelligentPracticeResult {
  const year = Math.max(7, Math.min(11, config.year || 8));
  const count = Math.max(1, Math.min(50, config.count || 10));
  const questionType = config.questionType ?? 'all';
  const questionStyle = config.questionStyle ?? 'all';
  const mode = config.mode ?? 'practice';

  const candidateCount = Math.max(80, count * 12);
  const candidates = dedupe(generateMixedMathsQuestions(year, candidateCount));

  const filtered = candidates
    .filter((question) => matchesTopic(question, config.topic))
    .filter((question) => matchesSkill(question, config.skill))
    .filter((question) => matchesDifficulty(question, config.difficulty))
    .filter((question) => matchesQuestionStyle(question, questionStyle));

  const selected: GeneratedQuestion[] = [];

  for (let index = 0; index < count; index += 1) {
    const requiredType = questionType === 'all' ? targetTypeForIndex(index) : questionType;
    const typeMatches = filtered.filter((question) => matchesQuestionType(question, requiredType) && !selected.includes(question));
    const fallbackMatches = filtered.filter((question) => !selected.includes(question));
    const pool = typeMatches.length > 0 ? typeMatches : fallbackMatches;
    if (pool.length === 0) break;

    const ranked = [...pool].sort((a, b) => {
      const difficultyA = config.difficulty === 'adaptive' ? Math.abs(a.difficulty - Math.min(5, Math.max(1, year - 5))) : 0;
      const difficultyB = config.difficulty === 'adaptive' ? Math.abs(b.difficulty - Math.min(5, Math.max(1, year - 5))) : 0;
      return difficultyA - difficultyB || boostForMode(b, mode) - boostForMode(a, mode) || b.marks - a.marks;
    });

    selected.push(ranked[0]);
  }

  while (selected.length < count) {
    selected.push(createFallbackQuestion(year, config.topic));
  }

  const questions = selected.slice(0, count).map((question, index) => ({
    ...question,
    id: `${question.id}-ip${index + 1}`,
    tags: [...new Set([...(question.tags ?? []), mode, questionStyle, questionType === 'all' ? 'all-question-types' : questionType])],
  }));

  const estimatedMinutes = Math.max(1, Math.round(questions.reduce((sum, question) => sum + question.estimatedSeconds, 0) / 60));
  const totalMarks = questions.reduce((sum, question) => sum + question.marks, 0);
  const topicLabel = config.topic && config.topic !== 'all' ? config.topic : 'Mixed topics';

  return {
    questions,
    summary: {
      title: mode === 'topic-test' ? `${topicLabel} topic test` : `${topicLabel} practice`,
      topic: topicLabel,
      skill: config.skill,
      year,
      count: questions.length,
      estimatedMinutes,
      totalMarks,
      questionType,
      questionStyle,
      mode,
    },
  };
}
