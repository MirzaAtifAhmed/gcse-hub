import type { ChildProfile, DashboardSummary } from '@gcse-hub/types';
import { type FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { api } from '../lib/api';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [message, setMessage] = useState('');

  async function loadDashboard() {
    const res = await api.get('/dashboard');
    setSummary(res.data.data);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function addChild(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    const form = new FormData(event.currentTarget);

    await api.post('/children', {
      name: String(form.get('name')),
      email: String(form.get('email')),
      password: String(form.get('password')),
      currentYear: Number(form.get('currentYear')),
      target: String(form.get('target')),
    });

    event.currentTarget.reset();
    setMessage('Child profile created.');
    await loadDashboard();
  }

  async function promoteChild(child: ChildProfile) {
    const nextYear = Math.min(11, child.currentYear + 1);
    await api.patch(`/children/${child.id}/promote`, { currentYear: nextYear });
    await loadDashboard();
  }

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
            <p>
              {isParent
                ? 'Add children, track learning and prepare for GCSEs.'
                : `Current focus: Year ${user.currentYear ?? 8}.`}
            </p>
          </div>
          <button className="btn btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>

        <section className="grid grid-3">
          <div className="stat">
            <span>Questions answered</span>
            <strong>{summary.stats.questionsAnswered}</strong>
          </div>
          <div className="stat">
            <span>Accuracy</span>
            <strong>{summary.stats.accuracy}%</strong>
          </div>
          <div className="stat">
            <span>Study time</span>
            <strong>{summary.stats.totalStudyMinutes}m</strong>
          </div>
        </section>

        {isParent && (
          <section className="grid grid-2 section">
            <form className="card" onSubmit={addChild}>
              <h2>Add child</h2>
              {message && <div className="success">{message}</div>}

              <div className="field">
                <label>Name</label>
                <input name="name" required />
              </div>

              <div className="field">
                <label>Child login email</label>
                <input name="email" type="email" required />
              </div>

              <div className="field">
                <label>Temporary password</label>
                <input name="password" type="password" minLength={8} required />
              </div>

              <div className="field">
                <label>Current year</label>
                <select name="currentYear" defaultValue="8">
                  <option value="7">Year 7</option>
                  <option value="8">Year 8</option>
                  <option value="9">Year 9</option>
                  <option value="10">Year 10</option>
                  <option value="11">Year 11</option>
                </select>
              </div>

              <div className="field">
                <label>Target</label>
                <select name="target" defaultValue="undecided">
                  <option value="undecided">Undecided</option>
                  <option value="foundation">Foundation</option>
                  <option value="higher">Higher</option>
                </select>
              </div>

              <button className="btn btn-primary" type="submit">
                Create child profile
              </button>
            </form>

            <section className="card">
              <h2>Children</h2>
              <div className="grid">
                {summary.children.length === 0 && <p>No children added yet.</p>}

                {summary.children.map((child) => (
                  <article className="child-card" key={child.id}>
                    <h3>{child.name}</h3>
                    <p>{child.email}</p>
                    <p>
                      Year {child.currentYear} · Target: {child.target}
                    </p>
                    <button
                      className="btn btn-secondary"
                      onClick={() => promoteChild(child)}
                      disabled={child.currentYear >= 11}
                    >
                      Promote year
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </section>
        )}

        <section className="card section">
          <h2>{isParent ? 'Available subjects' : 'Your subjects'}</h2>
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
