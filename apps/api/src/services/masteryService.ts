import { TopicMastery } from '../models/TopicMastery.js';

export async function recordTopicMastery(input: {
  studentId: string;
  topic: string;
  isCorrect: boolean;
  awardedMarks: number;
  totalMarks: number;
}) {
  const existing = await TopicMastery.findOne({
    studentId: input.studentId,
    topic: input.topic,
  });

  const attempts = (existing?.attempts ?? 0) + 1;
  const correct = (existing?.correct ?? 0) + (input.isCorrect ? 1 : 0);
  const totalMarks = (existing?.totalMarks ?? 0) + input.totalMarks;
  const awardedMarks = (existing?.awardedMarks ?? 0) + input.awardedMarks;
  const masteryPercent = totalMarks > 0 ? Math.round((awardedMarks / totalMarks) * 100) : 0;

  await TopicMastery.findOneAndUpdate(
    { studentId: input.studentId, topic: input.topic },
    {
      studentId: input.studentId,
      subject: 'Mathematics',
      topic: input.topic,
      attempts,
      correct,
      totalMarks,
      awardedMarks,
      masteryPercent,
      lastPractisedAt: new Date(),
    },
    { upsert: true, new: true },
  );
}
