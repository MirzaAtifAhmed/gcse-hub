import { ExamAttempt } from '../models/ExamAttempt.js';
import { TopicMastery } from '../models/TopicMastery.js';
import { User } from '../models/User.js';

const CORE_TOPIC_ORDER = [
  'Number',
  'Fractions, Decimals and Percentages',
  'Ratio and Proportion',
  'Algebra',
  'Angles',
  'Area',
  'Geometry',
  'Probability',
  'Statistics',
  'Measures',
];

function clampYear(year: number) {
  return Math.max(7, Math.min(11, Math.round(year || 8)));
}

function levelFromMastery(masteryPercent: number, attempts: number) {
  if (attempts === 0) return 'Not started';
  if (masteryPercent >= 90 && attempts >= 5) return 'Diamond';
  if (masteryPercent >= 80 && attempts >= 4) return 'Platinum';
  if (masteryPercent >= 70) return 'Gold';
  if (masteryPercent >= 55) return 'Silver';
  if (masteryPercent >= 35) return 'Bronze';
  return 'Build confidence';
}

function estimatedGradeFromScore(score: number, evidenceCount: number) {
  if (evidenceCount < 3) return 'Not enough evidence';
  if (score >= 88) return '8–9';
  if (score >= 76) return '7';
  if (score >= 66) return '6';
  if (score >= 55) return '5';
  if (score >= 42) return '4';
  if (score >= 30) return '2–3';
  return '1–2';
}

function readinessMessage(score: number, evidenceCount: number) {
  if (evidenceCount < 3) return 'Complete more practice and at least one timed paper to build a reliable picture.';
  if (score >= 80) return 'Strong GCSE readiness at the current level. Move into challenge and mixed exam questions.';
  if (score >= 65) return 'Good progress. Focus on exam-style wording and multi-step questions.';
  if (score >= 50) return 'Developing. Prioritise weak topics and regular topic tests.';
  return 'Start with short, guided topic practice to rebuild confidence before timed papers.';
}

function nextDifficulty(year: number, averageMastery: number) {
  const base = year <= 7 ? 2 : year === 8 ? 3 : year === 9 ? 3 : year === 10 ? 4 : 5;
  if (averageMastery >= 80) return Math.min(5, base + 1);
  if (averageMastery < 45) return Math.max(1, base - 1);
  return base;
}

function topicReason(masteryPercent: number, attempts: number) {
  if (attempts === 0) return 'No recent evidence yet.';
  if (attempts < 3) return 'Needs more practice evidence.';
  if (masteryPercent < 50) return 'Accuracy and marks are currently low.';
  if (masteryPercent < 70) return 'Close to secure, but needs more exam-style practice.';
  return 'Keep fresh with mixed revision.';
}

function buildTutorNudge(topic: string, masteryPercent: number) {
  if (masteryPercent < 45) {
    return `Start ${topic} with worked examples and hints switched on. Do not move on until you can explain the first step.`;
  }
  if (masteryPercent < 70) {
    return `Practise ${topic} with mixed question types and check every common mistake after marking.`;
  }
  return `Try GCSE-style ${topic} questions with fewer hints and focus on speed plus accuracy.`;
}

export async function buildAdaptiveMasteryDashboard(studentId: string, requestedYear?: number) {
  const [user, masteryRows, recentExams] = await Promise.all([
    User.findById(studentId).select('currentYear target role name'),
    TopicMastery.find({ studentId }).sort({ masteryPercent: 1, lastPractisedAt: -1 }).limit(60),
    ExamAttempt.find({ studentId, status: 'submitted' }).sort({ submittedAt: -1 }).limit(10),
  ]);

  const year = clampYear(requestedYear ?? user?.currentYear ?? 8);
  const masteryByTopic = new Map(masteryRows.map((row) => [row.topic, row]));
  const topics = CORE_TOPIC_ORDER.map((topic) => {
    const row = masteryByTopic.get(topic);
    const masteryPercent = row?.masteryPercent ?? 0;
    const attempts = row?.attempts ?? 0;
    return {
      topic,
      masteryPercent,
      attempts,
      correct: row?.correct ?? 0,
      level: levelFromMastery(masteryPercent, attempts),
      priority: attempts < 3 || masteryPercent < 60 ? 'high' : masteryPercent < 75 ? 'medium' : 'low',
      reason: topicReason(masteryPercent, attempts),
      tutorNudge: buildTutorNudge(topic, masteryPercent),
      lastPractisedAt: row?.lastPractisedAt?.toISOString(),
    };
  });

  const evidenceCount = masteryRows.reduce((sum, row) => sum + row.attempts, 0) + recentExams.length * 3;
  const averageMastery = masteryRows.length
    ? Math.round(masteryRows.reduce((sum, row) => sum + row.masteryPercent, 0) / masteryRows.length)
    : 0;
  const examAverage = recentExams.length
    ? Math.round(recentExams.reduce((sum, exam) => sum + (exam.percentage ?? 0), 0) / recentExams.length)
    : 0;
  const readinessScore = masteryRows.length && recentExams.length
    ? Math.round(averageMastery * 0.6 + examAverage * 0.4)
    : Math.max(averageMastery, examAverage);

  const weakTopics = topics.filter((topic) => topic.priority === 'high').slice(0, 5);
  const secureTopics = topics.filter((topic) => topic.masteryPercent >= 75 && topic.attempts >= 3).slice(0, 5);
  const difficulty = nextDifficulty(year, averageMastery || readinessScore);

  const recommendations = [
    ...weakTopics.slice(0, 3).map((topic) => ({
      title: `Revise ${topic.topic}`,
      topic: topic.topic,
      mode: 'practice',
      questionType: 'all',
      questionStyle: topic.masteryPercent < 50 ? 'standard' : 'gcse-exam-style',
      difficulty: topic.masteryPercent < 50 ? Math.max(1, difficulty - 1) : difficulty,
      count: 10,
      reason: topic.reason,
    })),
    {
      title: year >= 10 ? 'Do a timed GCSE-style mixed set' : 'Do a short mixed confidence set',
      topic: 'all',
      mode: year >= 10 ? 'timed-test' : 'practice',
      questionType: 'all',
      questionStyle: year >= 10 ? 'gcse-exam-style' : 'mixed',
      difficulty,
      count: year >= 10 ? 20 : 10,
      reason: 'Build fluency across topics rather than practising one topic only.',
    },
  ].slice(0, 5);

  const weeklyPlan = [
    {
      day: 'Monday',
      title: weakTopics[0] ? `${weakTopics[0].topic} confidence practice` : 'Mixed foundations',
      minutes: year >= 10 ? 30 : 20,
      mode: 'practice',
    },
    {
      day: 'Wednesday',
      title: weakTopics[1] ? `${weakTopics[1].topic} topic test` : 'Exam-style mixed set',
      minutes: year >= 10 ? 35 : 25,
      mode: 'topic-test',
    },
    {
      day: 'Friday',
      title: year >= 10 ? 'Timed GCSE-style paper section' : 'Mixed practice review',
      minutes: year >= 10 ? 45 : 25,
      mode: year >= 10 ? 'timed-test' : 'practice',
    },
    {
      day: 'Sunday',
      title: 'Review mistakes and redo similar questions',
      minutes: 20,
      mode: 'review',
    },
  ];

  return {
    student: {
      id: studentId,
      name: user?.name ?? 'Student',
      year,
      target: user?.target ?? 'undecided',
    },
    readiness: {
      score: readinessScore,
      message: readinessMessage(readinessScore, evidenceCount),
      estimatedGrade: estimatedGradeFromScore(readinessScore, evidenceCount),
      evidenceCount,
      averageMastery,
      examAverage,
      nextDifficulty: difficulty,
    },
    topics,
    weakTopics,
    secureTopics,
    recommendations,
    weeklyPlan,
    tutorSummary: {
      headline: weakTopics.length ? `Start with ${weakTopics[0].topic}` : 'Keep building mixed exam fluency',
      advice: weakTopics.length
        ? weakTopics[0].tutorNudge
        : 'You have no major weak topics showing yet. Use mixed GCSE-style questions to keep recall strong.',
      nextQuestionPrompt: weakTopics.length
        ? `Generate 10 ${weakTopics[0].topic} questions with all question types.`
        : 'Generate a mixed GCSE-style practice set.',
    },
  };
}
