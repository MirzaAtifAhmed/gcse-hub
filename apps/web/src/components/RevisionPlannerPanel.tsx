import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface RevisionPlanner {
  year: number;
  target: string;
  estimatedGrade: string;
  averagePercentage: number;
  priorityTopics: string[];
  examFocus: string;
  parentSummary: string;
  weeklyPlan: Array<{
    day: string;
    title: string;
    topic: string;
    minutes: number;
    activity: string;
    successCriteria: string;
  }>;
}

export function RevisionPlannerPanel({ year }: { year: number }) {
  const [planner, setPlanner] = useState<RevisionPlanner | null>(null);

  useEffect(() => {
    api
      .get(`/revision-planner/me?year=${year}`)
      .then((res) => setPlanner(res.data.data))
      .catch(() => setPlanner(null));
  }, [year]);

  if (!planner) {
    return null;
  }

  return (
    <section className="card section revision-planner-card">
      <div className="dashboard-header compact-header">
        <div>
          <span className="topic-pill">Weekly revision planner</span>
          <h2>Finish this week with a clear plan</h2>
          <p className="small-muted">A practical Year {planner.year} study plan based on recent exams and topic mastery.</p>
        </div>
        <div className="grade-pill grade-pill-light">
          <span>Working grade</span>
          <strong>{planner.estimatedGrade}</strong>
        </div>
      </div>

      <div className="revision-summary-grid">
        <article className="mini-card">
          <h4>Exam focus</h4>
          <p>{planner.examFocus}</p>
        </article>
        <article className="mini-card">
          <h4>Parent summary</h4>
          <p>{planner.parentSummary}</p>
        </article>
        <article className="mini-card">
          <h4>Priority topics</h4>
          <div className="strength-list">
            {planner.priorityTopics.map((topic) => (
              <span className="strength-pill" key={topic}>{topic}</span>
            ))}
          </div>
        </article>
      </div>

      <div className="revision-days">
        {planner.weeklyPlan.map((day) => (
          <article className="revision-day" key={day.day}>
            <div>
              <span>{day.day}</span>
              <strong>{day.title}</strong>
            </div>
            <p>{day.activity}</p>
            <small>{day.minutes} minutes · {day.successCriteria}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
