import type {
  ChildProfile,
  DashboardSummary,
  ExamAttempt,
  ExamSubmissionResult,
  GeneratedExamPaper,
  GeneratedQuestion,
  PracticeAnswerResult,
  QuestionTemplate,
  StudentReportSummary,
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
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [submission, setSubmission] = useState<ExamSubmissionResult | null>(null);
  const [report, setReport] = useState<StudentReportSummary | null>(null);
  const [results, setResults] = useState<Record<string, PracticeAnswerResult>>({});
  const [message, setMessage] = useState('');
  const [childError, setChildError] = useState('');

  async function loadDashboard() {
    const res = await api.get('/dashboard');
    setSummary(res.data.data);
  }

  async function loadMyReport() {
    const res = await api.get('/reports/me');
    setReport(res.data.data);
  }

  async function loadChildReport(childId: string) {
    const res = await api.get(`/reports/student/${childId}`);
    setReport(res.data.data);
  }

  async function loadPracticeQuestions() {
    const year = user?.currentYear ?? 8;
    const res = await api.get(`/questions/generated-practice?year=${year}&count=8`);
    setQuestions(res.data.data);
    setExam(null);
    setAttempt(null);
    setSubmission(null);
    setResults({});
  }

  async function generateExam(durationMinutes: number) {
    const year = user?.currentYear ?? 8;
    const examRes = await api.get(`/exams/generate?year=${year}&durationMinutes=${durationMinutes}`);
    const generatedExam = examRes.data.data as GeneratedExamPaper;
    const attemptRes = await api.post('/exams/attempts', { paper: generatedExam });

    setExam(generatedExam);
    setAttempt(attemptRes.data.data);
    setSubmission(null);
    setQuestions([]);
    setResults({});
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function addChild(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setChildError('');

    const form = new FormData(event.currentTarget);
    const password = String(form.get('password'));
    const confirmPassword = String(form.get('confirmPassword'));

    if (password !== confirmPassword) {
      setChildError('Passwords do not match.');
      return;
    }

    try {
      await api.post('/children', {
        firstName: String(form.get('firstName')),
        surname: String(form.get('surname')),
        email: String(form.get('email')),
        password,
        confirmPassword,
        currentYear: Number(form.get('currentYear')),
        target: String(form.get('target')),
      });

      event.currentTarget.reset();
      setMessage('Child profile created.');
      await loadDashboard();
    } catch {
      setChildError('Could not create child profile. The email may already be registered.');
    }
  }

  async function promoteChild(child: ChildProfile) {
    const nextYear = Math.min(11, child.currentYear + 1);
    await api.patch(`/children/${child.id}/promote`, { currentYear: nextYear });
    await loadDashboard();
  }

  async function submitPracticeAnswer(event: FormEvent<HTMLFormElement>, question: PracticeQuestion) {
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

  async function saveExamAnswer(event: FormEvent<HTMLFormElement>, questionId: string) {
    event.preventDefault();
    if (!attempt) {
      return;
    }

    const form = new FormData(event.currentTarget);
    const answer = String(form.get('answer')).trim();

    const res = await api.patch(`/exams/attempts/${attempt.id}/answers/${questionId}`, { answer });
    setAttempt(res.data.data);
  }

  async function submitExam() {
    if (!attempt) {
      return;
    }

    const res = await api.post(`/exams/attempts/${attempt.id}/submit`);
    setSubmission(res.data.data);
    setAttempt(res.data.data.attempt);
  }

  function renderReport() {
    if (!report) {
      return null;
    }

    return (
      <section className="card section">
        <h2>Progress report</h2>
        <div className="grid grid-3">
          <div className="stat">
            <span>Completed exams</span>
            <strong>{report.completedExams}</strong>
          </div>
          <div className="stat">
            <span>Questions answered</span>
            <strong>{report.questionsAnswered}</strong>
          </div>
          <div className="stat">
            <span>Average score</span>
            <strong>{report.averagePercentage}%</strong>
          </div>
        </div>

        <h3>Recent exams</h3>
        <div className="grid">
          {report.recentExams.length === 0 && <p>No submitted exams yet.</p>}
          {report.recentExams.map((examResult) => (
            <article className="child-card" key={examResult.id}>
              <strong>{examResult.title}</strong>
              <p>
                {examResult.awardedMarks}/{examResult.totalMarks} marks · {examResult.percentage}%
              </p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  function renderPracticeQuestion(question: PracticeQuestion, index?: number) {
    const result = results[question.id];

    return (
      <article className="child-card" key={question.id}>
        <h3>
          {index ? `Question ${index}: ` : ''}
          {question.title}
        </h3>
        <p>{question.questionText}</p>
        <form className="answer-form" onSubmit={(event) => submitPracticeAnswer(event, question)}>
          <input name="answer" placeholder="Type your answer" required />
          <button className="btn btn-primary" type="submit">
            Check answer
          </button>
        </form>
        {result && (
          <div className={result.isCorrect ? 'success-box' : 'error-box'}>
            <h4>{result.isCorrect ? 'Correct' : 'Not quite'}</h4>
            <p>
              Correct answer: <strong>{result.correctAnswer}</strong>
            </p>
            <ol>
              {result.solution.steps.map((step) => (
                <li key={step.order}>
                  {step.explanation} {step.working && <code>{step.working}</code>}
                </li>
              ))}
            </ol>
          </div>
        )}
      </article>
    );
  }

  function renderExamQuestion(question: GeneratedQuestion, index: number) {
    const submitted = submission?.questions.find((item) => item.question.id === question.id);

    return (
      <article className="child-card" key={question.id}>
        <h3>
          Question {index}: {question.title}
        </h3>
        <p>{question.questionText}</p>
        {!submission && (
          <form className="answer-form" onSubmit={(event) => saveExamAnswer(event, question.id)}>
            <input name="answer" placeholder="Type your answer" />
            <button className="btn btn-secondary" type="submit">
              Save answer
            </button>
          </form>
        )}
        {submitted && (
          <div className={submitted.isCorrect ? 'success-box' : 'error-box'}>
            <p>Your answer: {submitted.submittedAnswer || '-'}</p>
            <p>
              Correct answer: <strong>{question.answer}</strong>
            </p>
            <p>
              Mark: {submitted.awardedMarks}/{submitted.totalMarks}
            </p>
            <ol>
              {question.solution.steps.map((step) => (
                <li key={step.order}>
                  {step.explanation} {step.working && <code>{step.working}</code>}
                </li>
              ))}
            </ol>
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
              {childError && <div className="error">{childError}</div>}

              <div className="field">
                <label>First name</label>
                <input name="firstName" required />
              </div>

              <div className="field">
                <label>Surname</label>
                <input name="surname" required />
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
                <label>Confirm password</label>
                <input name="confirmPassword" type="password" minLength={8} required />
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
                    <div className="nav-links">
                      <button
                        className="btn btn-secondary"
                        onClick={() => promoteChild(child)}
                        disabled={child.currentYear >= 11}
                      >
                        Promote year
                      </button>
                      <button className="btn btn-primary" onClick={() => loadChildReport(child.id)}>
                        View report
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </section>
        )}

        {renderReport()}

        {!isParent && (
          <section className="card section">
            <div className="dashboard-header">
              <div>
                <h2>Maths practice and exams</h2>
                <p>Generate short practice sets or full timed papers with worked solutions.</p>
              </div>
              <div className="nav-links">
                <button className="btn btn-secondary" onClick={loadMyReport}>
                  My report
                </button>
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
                {attempt && !submission && (
                  <button className="btn btn-primary" onClick={submitExam}>
                    Submit exam
                  </button>
                )}
                {submission && (
                  <p>
                    <strong>
                      Score: {submission.attempt.awardedMarks}/{submission.attempt.totalMarks} (
                      {submission.attempt.percentage}%)
                    </strong>
                  </p>
                )}
              </section>
            )}

            <div className="grid">
              {questions.map((question) => renderPracticeQuestion(question))}
              {exam?.questions.map((question, index) => renderExamQuestion(question, index + 1))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
