import type {
  ChildProfile,
  DashboardSummary,
  GeneratedExamPaper,
  GeneratedQuestion,
  PracticeAnswerResult,
  QuestionTemplate,
} from '@gcse-hub/types';
import { type FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { api } from '../lib/api';

type PracticeQuestion = QuestionTemplate | GeneratedQuestion;

function isGeneratedQuestion(question: PracticeQuestion): question is GeneratedQuestion {
  return !('subjectId' in question);
}

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [exam, setExam] = useState<GeneratedExamPaper | null>(null);
  const [results, setResults] = useState<Record<string, PracticeAnswerResult>>({});
  const [message, setMessage] = useState('');

  async function loadDashboard() {
    const res = await api.get('/dashboard');
    setSummary(res.data.data);
  }

  async function loadPracticeQuestions() {
    const year = user?.currentYear ?? 8;
    const res = await api.get(`/questions/generated-practice?year=${year}&count=8`);
    setQuestions(res.data.data);
    setExam(null);
    setResults({});
  }

  async function generateExam(durationMinutes: number) {
    const year = user?.currentYear ?? 8;
    const res = await api.get(`/exams/generate?year=${year}&durationMinutes=${durationMinutes}`);
    setExam(res.data.data);
    setQuestions([]);
    setResults({});
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

  async function submitAnswer(event: FormEvent<HTMLFormElement>, question: PracticeQuestion) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const answer = String(form.get('answer')).trim();

    if (isGeneratedQuestion(question)) {
      const isCorrect =
        answer.toLowerCase().replace(/\s+/g, '').replace(/£/g, '') ===
        question.answer.toLowerCase().replace(/\s+/g, '').replace(/£/g, '');

      setResults((current) => ({
        ...current,
        [question.id]: {
          questionId: question.id,
          submittedAnswer: answer,
          correctAnswer: question.answer,
          isCorrect,
          awardedMarks: isCorrect ? question.marks : 0,
          totalMarks: question.marks,
          solution: question.solution,
          checkedAt: new Date().toISOString(),
        },
      }));
      return;
    }

    const res = await api.post(`/questions/${question.id}/answer`, { answer });
    setResults((current) => ({ ...current, [question.id]: res.data.data }));
  }

  function renderQuestion(question: PracticeQuestion, index?: number) {
    const result = results[question.id];

    return (
      <article className="child-card" key={question.id}>
        <h3>
          {index ? `Question ${index}: ` : ''}
          {question.title}
        </h3>
        <p>{question.questionText}</p>
        <p>
          Topic: {isGeneratedQuestion(question) ? question.topic : 'Maths'} · {question.marks} marks ·
          Difficulty {question.difficulty}
        </p>

        <form className="answer-form" onSubmit={(event) => submitAnswer(event, question)}>
          <input name="answer" placeholder="Type your answer" required />
          <button className="btn btn-primary" type="submit">
            Check answer
          </button>
        </form>

        {result && (
          <div className={result.isCorrect ? 'success-box' : 'error-box'}>
            <h4>{result.isCorrect ? 'Correct' : 'Not quite'}</h4>
            <p>
              Mark: {result.awardedMarks}/{result.totalMarks}
            </p>
            <p>
              Correct answer: <strong>{result.correctAnswer}</strong>
            </p>

            <h4>Worked solution</h4>
            <ol>
              {result.solution.steps.map((step) => (
                <li key={step.order}>
                  {step.explanation} {step.working && <code>{step.working}</code>}
                </li>
              ))}
            </ol>

            <h4>Mark scheme</h4>
            <ul>
              {result.solution.markScheme.map((point) => (
                <li key={point.description}>
                  {point.marks} mark(s): {point.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    );
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

        {!isParent && (
          <section className="card section">
            <div className="dashboard-header">
              <div>
                <h2>Maths practice and exams</h2>
                <p>Generate short practice sets or full timed papers with worked solutions.</p>
              </div>
              <div className="nav-links">
                <button className="btn btn-secondary" onClick={loadPracticeQuestions}>
                  Quick practice
                </button>
                <button className="btn btn-primary" onClick={() => generateExam(30)}>
                  30 min paper
                </button>
                <button className="btn btn-primary" onClick={() => generateExam(45)}>
                  45 min paper
                </button>
                <button className="btn btn-primary" onClick={() => generateExam(60)}>
                  60 min paper
                </button>
              </div>
            </div>

            {exam && (
              <section className="exam-summary">
                <h3>{exam.title}</h3>
                <p>
                  {exam.questions.length} questions · {exam.totalMarks} marks · {exam.durationMinutes}{' '}
                  minutes
                </p>
                <p>
                  Topics:{' '}
                  {Object.entries(exam.topicBreakdown)
                    .map(([topic, count]) => `${topic} (${count})`)
                    .join(', ')}
                </p>
              </section>
            )}

            <div className="grid">
              {questions.map((question) => renderQuestion(question))}
              {exam?.questions.map((question, index) => renderQuestion(question, index + 1))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
