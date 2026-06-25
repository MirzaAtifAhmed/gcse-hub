import type { GcseTarget, UserRole } from './index';

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
