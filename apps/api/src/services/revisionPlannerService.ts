import { ExamAttempt } from '../models/ExamAttempt.js';
import { TopicMastery } from '../models/TopicMastery.js';
import { User } from '../models/User.js';

const CORE_TOPICS = [
  'Fractions, Decimals and Percentages',
  'Ratio and Proportion',
  'Algebra',
  'Angles',
  'Area',
  'Probability',
  'Statistics',
  'Number',
];

const STUDY_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function clampYear(year: number) {
  return Math.max(7, Math.min(11, year));
}

function minutesForYear(year: number) {
  if (year >= 11) return 45;
  if (year >= 10) return 40;
  if (year >= 9) return 30;
  return 20;
}

function paperForYear(year: number) {
  if (year >= 11) return 'Complete one 90 minute GCSE-style mock paper.';
  if (year >= 10) return 'Complete one 60 minute timed paper.';
  if (year >= 9) return 'Complete one 45 minute mixed paper.';
  return 'Complete one 30 minute confidence paper.';
}

function gradeBand(percentage: number) {
  if (percentage >= 85) return '8–9';
  if (percentage >= 72) return '6–7';
  if (percentage >= 58) return '5';
  if (percentage >= 42) return '4';
  if (percentage >= 28) return '2–3';
  return '1–2';
}

export async function buildRevisionPlanner(studentId: string, requestedYear?: number) {
  const [student, mastery, recentExams] = await Promise.all([
    User.findById(studentId).select('currentYear target'),
    TopicMastery.find({ studentId }).sort({ masteryPercent: 1, attempts: 1, lastPractisedAt: 1 }).limit(20),
    ExamAttempt.find({ studentId, status: 'submitted' }).sort({ submittedAt: -1 }).limit(10),
  ]);

  const year = clampYear(requestedYear ?? student?.currentYear ?? 8);
  const averagePercentage = recentExams.length
    ? Math.round(recentExams.reduce((sum, exam) => sum + (exam.percentage ?? 0), 0) / recentExams.length)
    : 0;

  const weakTopics = mastery
    .filter((item) => item.masteryPercent < 65 || item.attempts < 3)
    .map((item) => item.topic);

  const practised = new Set(mastery.map((item) => item.topic));
  const notStarted = CORE_TOPICS.filter((topic) => !practised.has(topic));
  const priorityTopics = [...weakTopics, ...notStarted, ...CORE_TOPICS].filter(
    (topic, index, topics) => topics.indexOf(topic) === index,
  );

  const dailyMinutes = minutesForYear(year);
  const days = STUDY_DAYS.map((day, index) => {
    const topic = priorityTopics[index % priorityTopics.length] ?? 'Mixed GCSE practice';
    const isExamDay = index === STUDY_DAYS.length - 1;

    return {
      day,
      title: isExamDay ? 'Timed exam practice' : `Revise ${topic}`,
      topic: isExamDay ? 'Mixed paper' : topic,
      minutes: isExamDay ? dailyMinutes + 15 : dailyMinutes,
      activity: isExamDay
        ? paperForYear(year)
        : 'Do 8–10 questions: 4 confidence questions, 3 exam-style questions and 1 challenge question.',
      successCriteria: isExamDay
        ? 'Review every incorrect answer and record two topics to revise next week.'
        : 'Aim for at least 70% accuracy before moving to the next topic.',
    };
  });

  return {
    year,
    target: student?.target ?? 'undecided',
    estimatedGrade: recentExams.length ? gradeBand(averagePercentage) : 'Not enough data',
    averagePercentage,
    priorityTopics: priorityTopics.slice(0, 6),
    weeklyPlan: days,
    examFocus:
      year >= 10
        ? 'Build speed, accuracy and multi-step reasoning under timed conditions.'
        : 'Build strong KS3 foundations before increasing exam pressure.',
    parentSummary:
      priorityTopics.length > 0
        ? `This week should focus on ${priorityTopics.slice(0, 3).join(', ')}.`
        : 'Complete more practice to unlock targeted recommendations.',
  };
}
