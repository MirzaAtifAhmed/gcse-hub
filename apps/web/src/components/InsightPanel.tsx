import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface StudentInsight {
  student: { name: string; year: number; target: string };
  predictedGrade: string;
  readiness: string;
  trend: string;
  examAverage: number;
  masteryAverage: number;
  completedExams: number;
  questionsAnswered: number;
  weakTopics: Array<{ topic: string; masteryPercent: number; attempts: number }>;
  strengths: Array<{ topic: string; masteryPercent: number; attempts: number }>;
  nextBestActions: string[];
}

interface ParentInsight {
  children: Array<{
    id: string;
    name: string;
    email: string;
    year: number;
    target: string;
    predictedGrade: string;
    readiness: string;
    trend: string;
    examAverage: number;
    masteryAverage: number;
    priorityTopic: string;
    nextAction: string;
  }>;
  parentActions: string[];
}

function PercentBar({ value }: { value: number }) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div className="progress-bar insight-progress">
      <span style={{ width: `${safe}%` }} />
    </div>
  );
}

export function InsightPanel({ role }: { role: 'student' | 'parent' | 'admin' }) {
  const [studentInsight, setStudentInsight] = useState<StudentInsight | null>(null);
  const [parentInsight, setParentInsight] = useState<ParentInsight | null>(null);

  useEffect(() => {
    if (role === 'student') {
      api.get('/insights/me').then((res) => setStudentInsight(res.data.data)).catch(() => setStudentInsight(null));
    }

    if (role === 'parent') {
      api.get('/insights/parent').then((res) => setParentInsight(res.data.data)).catch(() => setParentInsight(null));
    }
  }, [role]);

  if (role === 'student' && studentInsight) {
    return (
      <section className="card section insight-card">
        <div className="dashboard-header compact-header">
          <div>
            <span className="topic-pill">GCSE readiness</span>
            <h2>Progress insight</h2>
            <p className="small-muted">Combines exam results, topic mastery and recent practice.</p>
          </div>
          <div className="grade-pill">
            <span>Predicted grade</span>
            <strong>{studentInsight.predictedGrade}</strong>
          </div>
        </div>

        <div className="grid grid-3">
          <div className="stat">
            <span>Readiness</span>
            <strong>{studentInsight.readiness}</strong>
          </div>
          <div className="stat">
            <span>Exam average</span>
            <strong>{studentInsight.completedExams ? `${studentInsight.examAverage}%` : 'No exams yet'}</strong>
            <PercentBar value={studentInsight.examAverage} />
          </div>
          <div className="stat">
            <span>Trend</span>
            <strong>{studentInsight.trend}</strong>
          </div>
        </div>

        <div className="learning-plan-grid">
          <div>
            <h3>Next best actions</h3>
            <ol className="action-list">
              {studentInsight.nextBestActions.map((action) => <li key={action}>{action}</li>)}
            </ol>
          </div>
          <div>
            <h3>Weak topics</h3>
            <div className="strength-list">
              {studentInsight.weakTopics.length === 0 && <span className="strength-pill">No weak topics yet</span>}
              {studentInsight.weakTopics.map((topic) => (
                <span className="priority-pill priority-medium" key={topic.topic}>{topic.topic} · {topic.masteryPercent}%</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (role === 'parent' && parentInsight) {
    return (
      <section className="card section insight-card">
        <div className="dashboard-header compact-header">
          <div>
            <span className="topic-pill">Parent insight</span>
            <h2>Family progress overview</h2>
            <p className="small-muted">See readiness, weak topics and the next action for each child.</p>
          </div>
        </div>

        <div className="grid">
          {parentInsight.children.length === 0 && <p>Add a child account to unlock insights.</p>}
          {parentInsight.children.map((child) => (
            <article className="mini-card insight-child-card" key={child.id}>
              <div>
                <h3>{child.name}</h3>
                <p>Year {child.year} · Target: {child.target} · Trend: {child.trend}</p>
              </div>
              <div className="grade-pill grade-pill-light">
                <span>Predicted</span>
                <strong>{child.predictedGrade}</strong>
              </div>
              <p><strong>Readiness:</strong> {child.readiness}</p>
              <p><strong>Priority topic:</strong> {child.priorityTopic}</p>
              <p><strong>Next action:</strong> {child.nextAction}</p>
            </article>
          ))}
        </div>

        <h3>Parent actions this week</h3>
        <ol className="action-list">
          {parentInsight.parentActions.map((action) => <li key={action}>{action}</li>)}
        </ol>
      </section>
    );
  }

  return null;
}
