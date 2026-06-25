export type UserRole = 'student' | 'parent' | 'admin';
export type KeyStage = 'KS3' | 'KS4';
export type GcseTarget = 'foundation' | 'higher' | 'undecided';
export type QuestionType = 'short-answer' | 'multiple-choice' | 'worked';
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  currentYear?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string;
  availableYears: number[];
  isActive?: boolean;
}

export interface CurriculumTopic {
  id: string;
  subjectId: string;
  name: string;
  slug: string;
  description: string;
  years: number[];
  priority: number;
}

export interface CurriculumSkill {
  id: string;
  topicId: string;
  name: string;
  slug: string;
  description: string;
  years: number[];
  difficulty: DifficultyLevel;
}

export interface ChildProfile {
  id: string;
  name: string;
  email: string;
  currentYear: number;
  target: GcseTarget;
  createdAt?: string;
}

export interface WorkedSolutionStep {
  order: number;
  explanation: string;
  working?: string;
}

export interface MarkSchemePoint {
  marks: number;
  description: string;
}

export interface QuestionSolution {
  finalAnswer: string;
  steps: WorkedSolutionStep[];
  markScheme: MarkSchemePoint[];
  commonMistakes?: string[];
}

export interface QuestionTemplate {
  id: string;
  subjectId: string;
  topicId: string;
  skillId: string;
  title: string;
  questionText: string;
  type: QuestionType;
  year: number;
  difficulty: DifficultyLevel;
  marks: number;
  estimatedSeconds: number;
  answer: string;
  solution: QuestionSolution;
  tags: string[];
}

export interface DashboardSummary {
  user: AuthUser;
  subjects: Subject[];
  children: ChildProfile[];
  stats: {
    questionsAnswered: number;
    accuracy: number;
    totalStudyMinutes: number;
    examsCompleted: number;
  };
}
