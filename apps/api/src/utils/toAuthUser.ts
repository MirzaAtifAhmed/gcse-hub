import type { AuthUser } from '@gcse-hub/types';
import type { UserDocument } from '../models/User.js';

export function toAuthUser(user: UserDocument): AuthUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role as AuthUser['role'],
    currentYear: user.currentYear ?? undefined,
  };
}