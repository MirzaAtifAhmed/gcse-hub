import type { HomeworkAssignmentSummary, TeacherClassSummary } from '@gcse-hub/types';
import { User } from '../models/User.js';

const TOPICS = ['Algebra', 'Angles', 'Ratio and Proportion', 'Probability', 'Fractions, Decimals and Percentages'];

export async function buildTeacherClassSummaries(): Promise<TeacherClassSummary[]> {
  const students = await User.find({ role: 'student' }).select('_id name currentYear target').lean();
  const grouped = new Map<number, typeof students>();

  for (const student of students) {
    const year = student.currentYear ?? 8;
    grouped.set(year, [...(grouped.get(year) ?? []), student]);
  }

  if (grouped.size === 0) {
    grouped.set(8, [] as typeof students);
  }

  return [...grouped.entries()].sort(([a], [b]) => a - b).map(([year, classStudents]) => ({
    id: `year-${year}`,
    name: `Year ${year} Maths`,
    year,
    studentCount: classStudents.length,
    averageAccuracy: classStudents.length ? Math.max(52, 84 - Math.abs(10 - year) * 3) : 0,
    weakestTopics: TOPICS.slice(year % 3, year % 3 + 3),
  }));
}

export function buildHomeworkAssignments(year = 8): HomeworkAssignmentSummary[] {
  return [
    {
      id: `hw-${year}-algebra`,
      title: `Year ${year} Algebra consolidation`,
      topic: 'Algebra',
      year,
      questionCount: 20,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'assigned',
      completionPercentage: 0,
    },
    {
      id: `hw-${year}-weak-topics`,
      title: `Year ${year} weak topic practice`,
      topic: TOPICS[year % TOPICS.length],
      year,
      questionCount: 15,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'draft',
      completionPercentage: 0,
    },
  ];
}
