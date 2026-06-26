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

export interface GeneratedQuestion {
  id: string;
  title: string;
  questionText: string;
  topic: string;
  skill: string;
  type: QuestionType;
  year: number;
  difficulty: DifficultyLevel;
  marks: number;
  estimatedSeconds: number;
  answer: string;
  solution: QuestionSolution;
  tags: string[];
}

export interface GeneratedExamPaper {
  id: string;
  title: string;
  subject: string;
  year: number;
  durationMinutes: number;
  totalMarks: number;
  estimatedSeconds: number;
  questions: GeneratedQuestion[];
  topicBreakdown: Record<string, number>;
  createdAt: string;
}

export interface PracticeAnswerResult {
  questionId: string;
  submittedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  awardedMarks: number;
  totalMarks: number;
  solution: QuestionSolution;
  checkedAt: string;
}

export interface AdminUserSummary {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  currentYear?: number;
  target?: GcseTarget;
  parentId?: string;
  parentName?: string;
  childrenCount: number;
  createdAt?: string;
}

export interface AdminAccountsSummary {
  totals: {
    all: number;
    parents: number;
    students: number;
    admins: number;
  };
  users: AdminUserSummary[];
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

export type ExamAttemptStatus = 'in-progress' | 'submitted';

export interface ExamAttemptAnswer {
  questionId: string;
  answer: string;
  isCorrect?: boolean;
  awardedMarks?: number;
  totalMarks: number;
}

export interface ExamAttempt {
  id: string;
  studentId: string;
  paper: GeneratedExamPaper;
  answers: ExamAttemptAnswer[];
  status: ExamAttemptStatus;
  startedAt: string;
  submittedAt?: string;
  totalMarks: number;
  awardedMarks: number;
  percentage: number;
}

export interface ExamAttemptResultQuestion {
  question: GeneratedQuestion;
  submittedAnswer: string;
  isCorrect: boolean;
  awardedMarks: number;
  totalMarks: number;
}

export interface ExamSubmissionResult {
  attempt: ExamAttempt;
  questions: ExamAttemptResultQuestion[];
}

export interface StudentReportSummary {
  student: ChildProfile | AuthUser;
  completedExams: number;
  questionsAnswered: number;
  averagePercentage: number;
  bestPercentage: number;
  recentExams: Array<{
    id: string;
    title: string;
    submittedAt?: string;
    percentage: number;
    awardedMarks: number;
    totalMarks: number;
  }>;
}