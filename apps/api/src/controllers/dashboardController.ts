import type { Request, Response } from 'express';
import { Subject } from '../models/Subject.js';
import { User } from '../models/User.js';
import { toAuthUser, toChildProfile, toSubjectDto } from '../utils/mappers.js';

export async function getDashboard(req: Request, res: Response) {
  const user = await User.findById(req.user?.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const [subjects, children] = await Promise.all([
    Subject.find({ isActive: true }).sort({ name: 1 }),
    user.role === 'parent'
      ? User.find({ parentId: user._id, role: 'student' }).sort({ createdAt: -1 })
      : Promise.resolve([]),
  ]);

  return res.json({
    success: true,
    data: {
      user: toAuthUser(user),
      subjects: subjects.map(toSubjectDto),
      children: children.map(toChildProfile),
      stats: {
        questionsAnswered: 0,
        accuracy: 0,
        totalStudyMinutes: 0,
        examsCompleted: 0,
      },
    },
  });
}
