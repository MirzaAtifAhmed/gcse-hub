import { ExamAttempt } from '../models/ExamAttempt.js';
import { TopicMastery } from '../models/TopicMastery.js';

interface TopicRecommendation {
  topic: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  suggestedActivity: string;
}

const CORE_MATHS_TOPICS = [
  'Fractions, Decimals and Percentages',
  'Ratio and Proportion',
  'Algebra',
  'Angles',
  'Area',
  'Probability',
  'Statistics',
  'Number',
];

function estimateGrade(percentage: number) {
  if (percentage >= 85) return '8–9';
  if (percentage >= 72) return '6–7';
  if (percentage >= 58) return '5';
  if (percentage >= 42) return '4';
  if (percentage >= 28) return '2–3';
  return '1–2';
}

function readinessLabel(percentage: number) {
  if (percentage >= 75) return 'GCSE ready for this level';
  if (percentage >= 55) return 'Developing well';
  if (percentage >= 35) return 'Needs targeted practice';
  return 'Start with confidence-building practice';
}

export async function buildLearningPlan(studentId: string, year = 8) {
  const [mastery, recentExams] = await Promise.all([
    TopicMastery.find({ studentId }).sort({ masteryPercent: 1, lastPractisedAt: -1 }).limit(20),
    ExamAttempt.find({ studentId, status: 'submitted' }).sort({ submittedAt: -1 }).limit(8),
  ]);

  const completedExams = recentExams.length;
  const averagePercentage = completedExams
    ? Math.round(recentExams.reduce((sum, exam) => sum + (exam.percentage ?? 0), 0) / completedExams)
    : 0;

  const weakTopics = mastery
    .filter((item) => item.masteryPercent < 60 || item.attempts < 3)
    .slice(0, 5)
    .map((item) => ({
      topic: item.topic,
      masteryPercent: item.masteryPercent,
      attempts: item.attempts,
      reason: item.attempts < 3 ? 'Needs more evidence' : 'Accuracy is below 60%',
    }));

  const strongTopics = mastery
    .filter((item) => item.masteryPercent >= 75 && item.attempts >= 2)
    .sort((a, b) => b.masteryPercent - a.masteryPercent)
    .slice(0, 5)
    .map((item) => ({
      topic: item.topic,
      masteryPercent: item.masteryPercent,
      attempts: item.attempts,
    }));

  const practisedTopicSet = new Set(mastery.map((item) => item.topic));
  const unpractisedTopics = CORE_MATHS_TOPICS.filter((topic) => !practisedTopicSet.has(topic));

  const recommendations: TopicRecommendation[] = [
    ...weakTopics.slice(0, 3).map((item) => ({
      topic: item.topic,
      reason: item.reason,
      priority: 'high' as const,
      suggestedActivity: 'Do 10 quick practice questions, then one timed exam-style question.',
    })),
    ...unpractisedTopics.slice(0, 2).map((topic) => ({
      topic,
      reason: 'Not enough practice data yet',
      priority: 'medium' as const,
      suggestedActivity: 'Start with a short mixed practice set to build baseline data.',
    })),
  ].slice(0, 5);

  const weeklyQuestionTarget = year >= 10 ? 45 : year >= 9 ? 35 : 25;
  const weeklyExamTarget = year >= 10 ? 1 : 0;

  return {
    year,
    readiness: readinessLabel(averagePercentage),
    estimatedGrade: completedExams ? estimateGrade(averagePercentage) : 'Not enough data',
    averagePercentage,
    completedExams,
    weeklyGoal: {
      questions: weeklyQuestionTarget,
      timedPapers: weeklyExamTarget,
      studyMinutes: year >= 10 ? 180 : year >= 9 ? 135 : 90,
    },
    nextActions: [
      recommendations.length ? `Revise ${recommendations[0].topic}` : 'Complete a quick practice set',
      year >= 10 ? 'Try one timed GCSE-style paper this week' : 'Build accuracy before increasing speed',
      'Review worked solutions for every mistake',
    ],
    recommendations,
    weakTopics,
    strongTopics,
  };
}
