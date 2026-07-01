import type { Request, Response } from 'express';
import { z } from 'zod';
import { buildHomeworkAssignments, buildTeacherClassSummaries } from '../services/teacherWorkspaceService.js';

const querySchema = z.object({ year: z.coerce.number().min(7).max(11).default(8) });

export async function getTeacherWorkspace(req: Request, res: Response) {
  const query = querySchema.parse(req.query);
  const classes = await buildTeacherClassSummaries();
  return res.json({
    success: true,
    data: {
      classes,
      homework: buildHomeworkAssignments(query.year),
      tools: [
        'Assign topic homework',
        'Generate printable worksheet',
        'Create custom paper',
        'Export class progress',
      ],
    },
  });
}
