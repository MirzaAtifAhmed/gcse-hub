import type { Request, Response } from 'express';
import { z } from 'zod';
import { User } from '../models/User.js';

const querySchema = z.object({
  role: z.enum(['student', 'parent', 'admin']).optional(),
  q: z.string().optional(),
});

export async function getAccountsOverview(req: Request, res: Response) {
  const query = querySchema.parse(req.query);
  const filter: Record<string, unknown> = {};

  if (query.role) {
    filter.role = query.role;
  }

  if (query.q) {
    filter.$or = [
      { name: { $regex: query.q, $options: 'i' } },
      { email: { $regex: query.q, $options: 'i' } },
    ];
  }

  const [users, parents, totals] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).limit(200),
    User.find({ role: 'parent' }).select('_id name'),
    Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: 'parent' }),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'admin' }),
    ]),
  ]);

  const parentMap = new Map(parents.map((parent) => [parent._id.toString(), parent.name]));

  return res.json({
    success: true,
    data: {
      totals: {
        all: totals[0],
        parents: totals[1],
        students: totals[2],
        admins: totals[3],
      },
      users: users.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        currentYear: user.currentYear ?? undefined,
        target: user.target ?? undefined,
        parentId: user.parentId?.toString(),
        parentName: user.parentId ? parentMap.get(user.parentId.toString()) : undefined,
        childrenCount: user.linkedChildren?.length ?? 0,
        createdAt: user.createdAt?.toISOString(),
      })),
    },
  });
}
