import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import { toAuthUser } from '../utils/mappers.js';

const registerSchema = z
  .object({
    firstName: z.string().min(2),
    surname: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    role: z.enum(['student', 'parent']).default('student'),
    currentYear: z.number().min(7).max(11).optional(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function setAuthCookie(res: Response, token: string) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export async function register(req: Request, res: Response) {
  const body = registerSchema.parse(req.body);

  const exists = await User.exists({ email: body.email.toLowerCase() });
  if (exists) {
    return res.status(409).json({ success: false, message: 'Email is already registered' });
  }

  const passwordHash = await bcrypt.hash(body.password, 12);
  const name = `${body.firstName} ${body.surname}`;

  const user = await User.create({
    firstName: body.firstName,
    surname: body.surname,
    name,
    email: body.email,
    passwordHash,
    role: body.role,
    currentYear: body.role === 'student' ? body.currentYear ?? 7 : undefined,
  });

  const token = signToken({ sub: user._id.toString(), role: user.role });
  setAuthCookie(res, token);

  return res.status(201).json({ success: true, data: { user: toAuthUser(user), token } });
}

export async function login(req: Request, res: Response) {
  const body = loginSchema.parse(req.body);

  const user = await User.findOne({ email: body.email.toLowerCase() });
  if (!user || !(await user.comparePassword(body.password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = signToken({ sub: user._id.toString(), role: user.role });
  setAuthCookie(res, token);

  return res.json({ success: true, data: { user: toAuthUser(user), token } });
}

export async function me(req: Request, res: Response) {
  const user = await User.findById(req.user?.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.json({ success: true, data: toAuthUser(user) });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie('token');
  return res.json({ success: true, message: 'Logged out' });
}
