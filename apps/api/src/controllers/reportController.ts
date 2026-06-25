import type { Request, Response } from 'express';
import { ExamAttempt } from '../models/ExamAttempt.js';
import { User } from '../models/User.js';
import { toAuthUser, toChildProfile } from '../utils/mappers.js';

async function buildReport(studentId: string) {
  const student = await User.findById(studentId);
  if (!student) return null;

  const attempts = await ExamAttempt.find({ studentId, status: 'submitted' })
    .sort({ submittedAt: -1 })
    .limit(20);

  const completedExams = attempts.length;
  const questionsAnswered = attempts.reduce((sum, attempt) => sum + attempt.answers.length, 0);
  const averagePercentage =
    completedExams > 0
      ? Math.round(attempts.reduce((sum, attempt) => sum + (attempt.percentage ?? 0), 0) / completedExams)
      : 0;
  const bestPercentage = completedExams > 0 ? Math.max(...attempts.map((a) => a.percentage ?? 0)) : 0;

  return {
    student: student.role === 'student' ? toChildProfile(student) : toAuthUser(student),
    completedExams,
    questionsAnswered,
    averagePercentage,
    bestPercentage,
    recentExams: attempts.map((attempt) => ({
      id: attempt._id.toString(),
      title: attempt.paper?.title ?? 'Maths paper',
      submittedAt: attempt.submittedAt?.toISOString(),
      percentage: attempt.percentage ?? 0,
      awardedMarks: attempt.awardedMarks ?? 0,
      totalMarks: attempt.totalMarks ?? 0,
    })),
  };
}

export async function getMyReport(req: Request, res: Response) {
  const report = await buildReport(String(req.user?.id));
  if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
  return res.json({ success: true, data: report });
}

export async function getStudentReport(req: Request, res: Response) {
  const student = await User.findOne({
    _id: req.params.studentId,
    parentId: req.user?.id,
    role: 'student',
  });

  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found for this parent' });
  }

  const report = await buildReport(student._id.toString());
  return res.json({ success: true, data: report });
}
