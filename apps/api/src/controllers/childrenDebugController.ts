import type { Request, Response } from 'express';
import { User } from '../models/User.js';

export async function debugChildCreationReadiness(req: Request, res: Response) {
  const parent = await User.findById(req.user?.id);

  return res.json({
    success: true,
    data: {
      authenticated: Boolean(req.user?.id),
      role: req.user?.role,
      canCreateChild: req.user?.role === 'parent',
      parentExists: Boolean(parent),
      parentEmail: parent?.email,
      requiredPayload: {
        firstName: 'string',
        surname: 'string',
        email: 'string email',
        password: 'string min 8',
        confirmPassword: 'must match password',
        currentYear: 'number 7-11',
        target: 'foundation | higher | undecided',
      },
    },
  });
}
