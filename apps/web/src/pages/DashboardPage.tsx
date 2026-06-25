import type { DashboardSummary } from '@gcse-hub/types';
import { useEffect, useState } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { api } from '../lib/api';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    api.get('/dashboard').then((res) => setSummary(res.data.data));
  }, []);

  if (!user || !summary) {
    return <main className="form-page">Loading dashboard…</main>;
  }

  const isParent = user.role === 'parent';

  return (
    <main className="page dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <div className="brand">GCSE Hub</div>
            <h1>{isParent ? `Welcome, ${user.name}` : `Hello, ${user.name}`}</h1>
            <p>{isParent ? 'Track learning progress and support your child’s GCSE journey.' : `Current focus: Year ${user.currentYear ?? 8}.`}</p>
          </div>
          <button className="btn btn-secondary" onClick={logout}>Logout</button>
        </div>

        <section className="grid grid-3">
          <div className="stat"><span>Questions answered</span><strong>{summary.stats.questionsAnswered}</strong></div>
          <div className="stat"><span>Accuracy</span><strong>{summary.stats.accuracy}%</strong></div>
          <div className="stat"><span>Study time</span><strong>{summary.stats.totalStudyMinutes}m</strong></div>
        </section>

        <section className="card" style={{ marginTop: 24 }}>
          <h2>{isParent ? 'Subjects you can enable' : 'Your subjects'}</h2>
          <div className="grid grid-3">
            {summary.subjects.map((subject) => (
              <article className="subject-card" key={subject.id}>
                <h3>{subject.name}</h3>
                <p>{subject.description}</p>
                <small>Years {subject.availableYears.join(', ')}</small>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
