import type { HomeworkAssignmentSummary, TeacherClassSummary } from '@gcse-hub/types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

type TeacherWorkspace = {
  classes: TeacherClassSummary[];
  homework: HomeworkAssignmentSummary[];
  tools: string[];
};

export function TeacherWorkspacePage() {
  const [workspace, setWorkspace] = useState<TeacherWorkspace | null>(null);
  const [year, setYear] = useState('8');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/teacher-workspace?year=${year}`)
      .then((res) => setWorkspace(res.data.data))
      .catch(() => setError('Teacher workspace is currently available to admin users only.'));
  }, [year]);

  return (
    <main className="page dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <div className="brand">GCSE Hub</div>
            <h1>Teacher workspace</h1>
            <p>Create homework, monitor class performance and generate teaching resources.</p>
          </div>
          <Link className="btn btn-secondary" to="/dashboard">Back to dashboard</Link>
        </div>

        <section className="card section">
          <label className="field compact-field">
            <span>Planning year</span>
            <select value={year} onChange={(event) => setYear(event.target.value)}>
              {[7, 8, 9, 10, 11].map((item) => <option value={item} key={item}>Year {item}</option>)}
            </select>
          </label>
          {error && <div className="error-box">{error}</div>}
        </section>

        {workspace && (
          <>
            <section className="grid grid-3 section">
              {workspace.classes.map((item) => (
                <article className="stat" key={item.id}>
                  <span>{item.name}</span>
                  <strong>{item.studentCount}</strong>
                  <p>{item.averageAccuracy}% average accuracy</p>
                  <p className="small-muted">Weakest: {item.weakestTopics.join(', ')}</p>
                </article>
              ))}
            </section>

            <section className="card section">
              <div className="dashboard-header">
                <div>
                  <h2>Homework planner</h2>
                  <p>Draft assignments can be used as templates for class homework.</p>
                </div>
                <Link className="btn btn-primary" to="/worksheets">Create worksheet</Link>
              </div>
              <div className="grid">
                {workspace.homework.map((item) => (
                  <article className="child-card" key={item.id}>
                    <span className="topic-pill">{item.status}</span>
                    <h3>{item.title}</h3>
                    <p>{item.topic} · {item.questionCount} questions · Year {item.year}</p>
                    <p>Completion: {item.completionPercentage}%</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="card section">
              <h2>Teacher tools</h2>
              <div className="grid grid-3">
                {workspace.tools.map((tool) => <div className="child-card" key={tool}>{tool}</div>)}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
