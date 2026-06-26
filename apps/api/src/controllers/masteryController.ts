import type { Request, Response } from 'express';
import { TopicMastery } from '../models/TopicMastery.js';

export async function getMyMastery(req: Request, res: Response) {
  const mastery = await TopicMastery.find({ studentId: req.user?.id }).sort({ masteryPercent: 1, topic: 1 });

  return res.json({
    success: true,
    data: mastery.map((item) => ({
      id: item._id.toString(),
      topic: item.topic,
      attempts: item.attempts,
      correct: item.correct,
      totalMarks: item.totalMarks,
      awardedMarks: item.awardedMarks,
      masteryPercent: item.masteryPercent,
      lastPractisedAt: item.lastPractisedAt?.toISOString(),
    })),
  });
}
