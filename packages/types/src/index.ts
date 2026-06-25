export type UserRole = 'student' | 'parent' | 'admin';
export type KeyStage = 'KS3' | 'KS4';
export type GcseTarget = 'foundation' | 'higher' | 'undecided';

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

export interface ChildProfile {
  id: string;
  name: string;
  email: string;
  currentYear: number;
  target: GcseTarget;
  createdAt?: string;
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