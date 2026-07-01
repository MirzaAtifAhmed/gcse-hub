export type UserRole = 'student' | 'parent' | 'admin';
export type KeyStage = 'KS3' | 'KS4';
export type GcseTarget = 'foundation' | 'higher' | 'undecided';
export type ExamBoardPreference = 'aqa' | 'edexcel' | 'ocr' | 'mixed';
export type LearningPreference = 'worked-examples' | 'diagrams' | 'exam-questions' | 'short-sessions';
export type QuestionType = 'short-answer' | 'multiple-choice' | 'worked';
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;
export type ExamAttemptStatus = 'in-progress' | 'submitted';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  currentYear?: number;
  target?: GcseTarget;
  currentLevel?: number;
  targetGrade?: number;
  examBoard?: ExamBoardPreference;
  studyGoalMinutesPerDay?: number;
  learningPreferences?: LearningPreference[];
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
  currentLevel?: number;
  targetGrade?: number;
  examBoard?: ExamBoardPreference;
  studyGoalMinutesPerDay?: number;
  learningPreferences?: LearningPreference[];
  createdAt?: string;
}

export interface ProfileSettings {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  firstName: string;
  surname: string;
  currentYear?: number;
  target?: GcseTarget;
  currentLevel?: number;
  targetGrade?: number;
  examBoard?: ExamBoardPreference;
  studyGoalMinutesPerDay?: number;
  learningPreferences?: LearningPreference[];
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

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface DiagramSpec {
  type:
    | 'none'
    | 'angle-line'
    | 'rectangle'
    | 'triangle'
    | 'circle'
    | 'bar-chart'
    | 'line-graph'
    | 'coordinate-grid'
    | 'ratio-bar';
  data?: Record<string, unknown>;
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
  options?: QuestionOption[];
  diagram?: DiagramSpec;
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
  options?: QuestionOption[];
  diagram?: DiagramSpec;
  calculatorAllowed?: boolean;
  examStyle?: boolean;
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

export type DiagnosticConfidence = 'low' | 'medium' | 'high';
export type LearningPathStatus = 'not-started' | 'in-progress' | 'mastered';
export type HomeworkStatus = 'draft' | 'assigned' | 'closed';
export type WorksheetFormat = 'worksheet' | 'mark-scheme' | 'both';

export interface DiagnosticAssessmentSummary {
  id: string;
  studentId: string;
  year: number;
  estimatedGrade: number;
  currentLevel: number;
  suggestedTarget: GcseTarget;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  questions: GeneratedQuestion[];
  createdAt: string;
}

export interface DiagnosticAnswerInput {
  questionId: string;
  answer: string;
  confidence?: DiagnosticConfidence;
}

export interface LearningPathStep {
  id: string;
  title: string;
  topic: string;
  skill: string;
  estimatedMinutes: number;
  status: LearningPathStatus;
  recommendedMode: 'learn' | 'practice' | 'test' | 'review';
}

export interface TeacherClassSummary {
  id: string;
  name: string;
  year: number;
  studentCount: number;
  averageAccuracy: number;
  weakestTopics: string[];
}

export interface HomeworkAssignmentSummary {
  id: string;
  title: string;
  topic: string;
  year: number;
  questionCount: number;
  dueDate?: string;
  status: HomeworkStatus;
  completionPercentage: number;
}

export interface WorksheetQuestion {
  number: number;
  question: GeneratedQuestion;
}

export interface WorksheetPack {
  id: string;
  title: string;
  subject: string;
  year: number;
  topic: string;
  format: WorksheetFormat;
  questions: WorksheetQuestion[];
  totalMarks: number;
  estimatedMinutes: number;
  generatedAt: string;
}

export interface SubjectLaunchSummary {
  subject: 'Mathematics' | 'English' | 'Science';
  status: 'ready' | 'starter' | 'planned';
  years: number[];
  strands: string[];
  sampleTopics: string[];
}
