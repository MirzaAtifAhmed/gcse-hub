import type { NextFunction, Request, Response } from 'express';
import { User } from '../models/User.js';
import { verifyToken } from '../utils/jwt.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: 'student' | 'parent' | 'admin';
      };
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : req.cookies?.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub).select('_id role');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = { id: user._id.toString(), role: payload.role };
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

export function requireRole(...roles: Array<'student' | 'parent' | 'admin'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    return next();
  };
}
