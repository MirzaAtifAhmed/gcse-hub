import type { Request, Response } from 'express';
import { z } from 'zod';
import { CurriculumTopic } from '../models/CurriculumTopic.js';
import { QuestionTemplate } from '../models/QuestionTemplate.js';
import { Subject } from '../models/Subject.js';

const querySchema = z.object({
  subjectSlug: z.string().default('mathematics'),
  year: z.coerce.number().min(7).max(11).default(8),
});

export async function getTopicCoverage(req: Request, res: Response) {
  const query = querySchema.parse(req.query);
  const subject = await Subject.findOne({ slug: query.subjectSlug, isActive: true });

  if (!subject) {
    return res.status(404).json({ success: false, message: 'Subject not found' });
  }

  const topics = await CurriculumTopic.find({ subjectId: subject._id, years: query.year }).sort({
    priority: -1,
    name: 1,
  });

  const data = await Promise.all(
    topics.map(async (topic) => {
      const questionCount = await QuestionTemplate.countDocuments({
        topicId: topic._id,
        year: query.year,
        isActive: true,
      });

      return {
        id: topic._id.toString(),
        name: topic.name,
        slug: topic.slug,
        description: topic.description,
        priority: topic.priority ?? 5,
        year: query.year,
        questionCount,
        status: questionCount > 0 ? 'ready' : 'needs-content',
      };
    }),
  );

  return res.json({ success: true, data });
}
