export type UserRole = 'student' | 'parent' | 'admin';

export type KeyStage = 'KS3' | 'KS4';

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
}

export interface DashboardSummary {
  user: AuthUser;
  subjects: Subject[];
  stats: {
    questionsAnswered: number;
    accuracy: number;
    totalStudyMinutes: number;
    examsCompleted: number;
  };
}
