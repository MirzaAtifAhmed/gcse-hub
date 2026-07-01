import type { GeneratedQuestion, SubjectLaunchSummary } from '@gcse-hub/types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { QuestionCard } from '../components/QuestionCard';
import { api } from '../lib/api';

export function SubjectExpansionPage() {
  const [subjects, setSubjects] = useState<SubjectLaunchSummary[]>([]);
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('english');
  const [year, setYear] = useState('8');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/subject-expansion')
      .then((res) => setSubjects(res.data.data))
      .catch(() => setError('Could not load subject roadmap.'));
  }, []);

  async function loadStarterPractice(subject = selectedSubject) {
    setError('');
    try {
      const res = await api.get(`/subject-expansion/starter-practice?subject=${subject}&year=${year}`);
      setQuestions(res.data.data);
    } catch {
      setError('Could not load starter practice.');
    }
  }

  return (
    <main className="page dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <div className="brand">GCSE Hub</div>
            <h1>Subject expansion</h1>
            <p>Track Maths readiness and start the English and Science rollout.</p>
          </div>
          <Link className="btn btn-secondary" to="/dashboard">Back to dashboard</Link>
        </div>
        {error && <div className="error-box">{error}</div>}

        <section className="grid grid-3 section">
          {subjects.map((subject) => (
            <article className="card" key={subject.subject}>
              <span className="topic-pill">{subject.status}</span>
              <h2>{subject.subject}</h2>
              <p>Years {subject.years.join(', ')}</p>
              <p><strong>Strands:</strong> {subject.strands.join(', ')}</p>
              <p className="small-muted">Sample: {subject.sampleTopics.join(', ')}</p>
              {subject.status !== 'planned' && (
                <button className="btn btn-secondary" onClick={() => { setSelectedSubject(subject.subject.toLowerCase()); loadStarterPractice(subject.subject.toLowerCase()); }}>
                  Try starter practice
                </button>
              )}
            </article>
          ))}
        </section>

        <section className="card section">
          <div className="dashboard-header">
            <div>
              <h2>Starter practice</h2>
              <p>Use this to validate the new multi-subject framework before adding full content.</p>
            </div>
            <div className="nav-links">
              <select value={selectedSubject} onChange={(event) => setSelectedSubject(event.target.value)}>
                <option value="english">English</option>
                <option value="science">Science</option>
              </select>
              <select value={year} onChange={(event) => setYear(event.target.value)}>
                {[7, 8, 9, 10, 11].map((item) => <option value={item} key={item}>Year {item}</option>)}
              </select>
              <button className="btn btn-primary" onClick={() => loadStarterPractice()}>Load</button>
            </div>
          </div>
          <div className="grid">
            {questions.map((question, index) => <QuestionCard question={question} index={index + 1} key={question.id} />)}
          </div>
        </section>
      </div>
    </main>
  );
}
