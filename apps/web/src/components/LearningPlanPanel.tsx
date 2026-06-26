import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface LearningPlan {
  year: number;
  readiness: string;
  estimatedGrade: string;
  averagePercentage: number;
  completedExams: number;
  weeklyGoal: {
    questions: number;
    timedPapers: number;
    studyMinutes: number;
  };
  nextActions: string[];
  recommendations: Array<{
    topic: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
    suggestedActivity: string;
  }>;
  weakTopics: Array<{
    topic: string;
    masteryPercent: number;
    attempts: number;
    reason: string;
  }>;
  strongTopics: Array<{
    topic: string;
    masteryPercent: number;
    attempts: number;
  }>;
}

export function LearningPlanPanel({ year }: { year: number }) {
  const [plan, setPlan] = useState<LearningPlan | null>(null);

  useEffect(() => {
    api
      .get(`/learning-plan/me?year=${year}`)
      .then((res) => setPlan(res.data.data))
      .catch(() => setPlan(null));
  }, [year]);

  if (!plan) {
    return null;
  }

  return (
    <section className="card section learning-plan-card">
      <div className="dashboard-header compact-header">
        <div>
          <span className="topic-pill">Adaptive plan</span>
          <h2>Year {plan.year} learning plan</h2>
          <p className="small-muted">Personalised from exams, marked answers and topic mastery.</p>
        </div>
        <div className="grade-pill">
          <span>Estimated grade</span>
          <strong>{plan.estimatedGrade}</strong>
        </div>
      </div>

      <div className="grid grid-3">
        <div className="stat">
          <span>Readiness</span>
          <strong>{plan.readiness}</strong>
        </div>
        <div className="stat">
          <span>Average score</span>
          <strong>{plan.completedExams ? `${plan.averagePercentage}%` : 'No exams yet'}</strong>
        </div>
        <div className="stat">
          <span>Weekly goal</span>
          <strong>{plan.weeklyGoal.questions} questions</strong>
          <small>{plan.weeklyGoal.studyMinutes} study minutes</small>
        </div>
      </div>

      <div className="learning-plan-grid">
        <div>
          <h3>Recommended next</h3>
          <div className="grid">
            {plan.recommendations.length === 0 && <p>Complete a quick practice set to unlock recommendations.</p>}
            {plan.recommendations.map((item) => (
              <article className="mini-card" key={`${item.topic}-${item.reason}`}>
                <span className={`priority-pill priority-${item.priority}`}>{item.priority}</span>
                <h4>{item.topic}</h4>
                <p>{item.reason}</p>
                <small>{item.suggestedActivity}</small>
              </article>
            ))}
          </div>
        </div>

        <div>
          <h3>Next actions</h3>
          <ol className="action-list">
            {plan.nextActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ol>

          <h3>Strengths</h3>
          <div className="strength-list">
            {plan.strongTopics.length === 0 && <p className="small-muted">Strengths will appear after more practice.</p>}
            {plan.strongTopics.map((item) => (
              <span className="strength-pill" key={item.topic}>
                {item.topic} · {item.masteryPercent}%
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
