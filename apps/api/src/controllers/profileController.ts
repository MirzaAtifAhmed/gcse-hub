import type { ProfileSettings } from '@gcse-hub/types';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { User } from '../models/User.js';
import { toAuthUser, toChildProfile } from '../utils/mappers.js';

const learningPreferenceSchema = z.enum([
  'worked-examples',
  'diagrams',
  'exam-questions',
  'short-sessions',
]);

const profileSchema = z.object({
  firstName: z.string().min(2).optional(),
  surname: z.string().min(2).optional(),
  currentYear: z.coerce.number().min(7).max(11).optional(),
  target: z.enum(['foundation', 'higher', 'undecided']).optional(),
  currentLevel: z.coerce.number().min(1).max(11).optional(),
  targetGrade: z.coerce.number().min(1).max(9).optional(),
  examBoard: z.enum(['aqa', 'edexcel', 'ocr', 'mixed']).optional(),
  studyGoalMinutesPerDay: z.coerce.number().min(5).max(180).optional(),
  learningPreferences: z.array(learningPreferenceSchema).optional(),
});

function toProfileSettings(user: any): ProfileSettings {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    surname: user.surname,
    currentYear: user.currentYear ?? undefined,
    target: user.target ?? undefined,
    currentLevel: user.currentLevel ?? undefined,
    targetGrade: user.targetGrade ?? undefined,
    examBoard: user.examBoard ?? undefined,
    studyGoalMinutesPerDay: user.studyGoalMinutesPerDay ?? undefined,
    learningPreferences: user.learningPreferences ?? [],
  };
}

function buildProfileUpdate(body: z.infer<typeof profileSchema>) {
  const update: Record<string, unknown> = {};

  for (const key of [
    'currentYear',
    'target',
    'currentLevel',
    'targetGrade',
    'examBoard',
    'studyGoalMinutesPerDay',
    'learningPreferences',
  ] as const) {
    if (body[key] !== undefined) update[key] = body[key];
  }

  if (body.firstName !== undefined) update.firstName = body.firstName;
  if (body.surname !== undefined) update.surname = body.surname;
  if (body.firstName !== undefined || body.surname !== undefined) {
    update.name = `${body.firstName ?? ''} ${body.surname ?? ''}`.trim();
  }

  return update;
}

export async function getMyProfile(req: Request, res: Response) {
  const user = await User.findById(req.user?.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  return res.json({ success: true, data: toProfileSettings(user) });
}

export async function updateMyProfile(req: Request, res: Response) {
  const body = profileSchema.parse(req.body);
  const existingUser = await User.findById(req.user?.id);
  if (!existingUser) return res.status(404).json({ success: false, message: 'User not found' });

  const update = buildProfileUpdate({
    ...body,
    firstName: body.firstName ?? existingUser.firstName,
    surname: body.surname ?? existingUser.surname,
  });

  const user = await User.findByIdAndUpdate(req.user?.id, update, { new: true });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  return res.json({ success: true, data: { profile: toProfileSettings(user), user: toAuthUser(user) } });
}

export async function updateChildProfile(req: Request, res: Response) {
  const body = profileSchema
    .omit({ firstName: true, surname: true })
    .extend({ firstName: z.string().min(2).optional(), surname: z.string().min(2).optional() })
    .parse(req.body);

  const child = await User.findOne({ _id: req.params.childId, parentId: req.user?.id, role: 'student' });
  if (!child) return res.status(404).json({ success: false, message: 'Child not found' });

  const update = buildProfileUpdate({
    ...body,
    firstName: body.firstName ?? child.firstName,
    surname: body.surname ?? child.surname,
  });

  const updated = await User.findOneAndUpdate(
    { _id: req.params.childId, parentId: req.user?.id, role: 'student' },
    update,
    { new: true },
  );

  if (!updated) return res.status(404).json({ success: false, message: 'Child not found' });
  return res.json({ success: true, data: toChildProfile(updated) });
}

export async function getChildProfile(req: Request, res: Response) {
  const child = await User.findOne({ _id: req.params.childId, parentId: req.user?.id, role: 'student' });
  if (!child) return res.status(404).json({ success: false, message: 'Child not found' });

  return res.json({ success: true, data: toProfileSettings(child) });
}
