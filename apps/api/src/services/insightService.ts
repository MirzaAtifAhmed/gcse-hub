import { ExamAttempt } from '../models/ExamAttempt.js';
import { TopicMastery } from '../models/TopicMastery.js';
import { User } from '../models/User.js';

function gradeBand(percentage: number) {
  if (percentage >= 85) return '8–9';
  if (percentage >= 72) return '6–7';
  if (percentage >= 58) return '5';
  if (percentage >= 42) return '4';
  if (percentage >= 28) return '2–3';
  return '1–2';
}

function trendLabel(values: number[]) {
  if (values.length < 2) return 'Not enough data';
  const latest = values[0];
  const previous = values.slice(1).reduce((sum, value) => sum + value, 0) / (values.length - 1);
  if (latest >= previous + 8) return 'Improving quickly';
  if (latest >= previous + 3) return 'Improving';
  if (latest <= previous - 8) return 'Needs attention';
  return 'Stable';
}

function readinessFromMastery(masteryAverage: number, examAverage: number) {
  const blended = Math.round(masteryAverage * 0.45 + examAverage * 0.55);
  if (blended >= 75) return 'On track for GCSE target';
  if (blended >= 55) return 'Developing towards GCSE standard';
  if (blended >= 35) return 'Needs focused intervention';
  return 'Build foundations first';
}

export async function buildStudentInsight(studentId: string) {
  const [student, mastery, exams] = await Promise.all([
    User.findById(studentId).select('name currentYear target'),
    TopicMastery.find({ studentId }).sort({ masteryPercent: 1, attempts: 1, lastPractisedAt: -1 }).limit(40),
    ExamAttempt.find({ studentId, status: 'submitted' }).sort({ submittedAt: -1 }).limit(12),
  ]);

  const examPercentages = exams.map((exam) => exam.percentage ?? 0);
  const examAverage = examPercentages.length
    ? Math.round(examPercentages.reduce((sum, value) => sum + value, 0) / examPercentages.length)
    : 0;
  const masteryAverage = mastery.length
    ? Math.round(mastery.reduce((sum, item) => sum + (item.masteryPercent ?? 0), 0) / mastery.length)
    : 0;

  const weakTopics = mastery
    .filter((item) => item.masteryPercent < 65 || item.attempts < 3)
    .slice(0, 5)
    .map((item) => ({ topic: item.topic, masteryPercent: item.masteryPercent, attempts: item.attempts }));

  const strengths = mastery
    .filter((item) => item.masteryPercent >= 75 && item.attempts >= 2)
    .sort((a, b) => b.masteryPercent - a.masteryPercent)
    .slice(0, 5)
    .map((item) => ({ topic: item.topic, masteryPercent: item.masteryPercent, attempts: item.attempts }));

  const nextBestActions = [
    weakTopics[0] ? `Revise ${weakTopics[0].topic} with 10 mixed questions.` : 'Complete a quick practice set to create a baseline.',
    exams.length ? 'Review the last submitted paper and redo every incorrect question.' : 'Attempt a 30 minute starter paper.',
    (student?.currentYear ?? 8) >= 10 ? 'Complete one timed GCSE-style paper this week.' : 'Focus on accuracy before speed.',
  ];

  return {
    student: {
      name: student?.name ?? 'Student',
      year: student?.currentYear ?? 8,
      target: student?.target ?? 'undecided',
    },
    predictedGrade: exams.length ? gradeBand(examAverage) : 'Not enough data',
    readiness: readinessFromMastery(masteryAverage, examAverage),
    trend: trendLabel(examPercentages),
    examAverage,
    masteryAverage,
    completedExams: exams.length,
    questionsAnswered: mastery.reduce((sum, item) => sum + (item.attempts ?? 0), 0),
    weakTopics,
    strengths,
    nextBestActions,
  };
}

export async function buildParentInsight(parentId: string) {
  const children = await User.find({ parentId, role: 'student' }).select('_id name email currentYear target').sort({ createdAt: -1 });
  const summaries = await Promise.all(
    children.map(async (child) => {
      const insight = await buildStudentInsight(child._id.toString());
      return {
        id: child._id.toString(),
        name: child.name,
        email: child.email,
        year: child.currentYear ?? 8,
        target: child.target ?? 'undecided',
        predictedGrade: insight.predictedGrade,
        readiness: insight.readiness,
        trend: insight.trend,
        examAverage: insight.examAverage,
        masteryAverage: insight.masteryAverage,
        priorityTopic: insight.weakTopics[0]?.topic ?? 'Complete more practice',
        nextAction: insight.nextBestActions[0],
      };
    }),
  );

  return {
    children: summaries,
    parentActions: summaries.length
      ? [
          'Ask each child to explain one mistake from their last paper.',
          'Schedule one timed practice session this week.',
          'Check weak topics before setting a new paper.',
        ]
      : ['Add a child account to unlock parent insights.'],
  };
}
