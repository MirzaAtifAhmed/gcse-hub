import type { DiagnosticAnswerInput, DiagnosticAssessmentSummary, GeneratedQuestion, LearningPathStep } from '@gcse-hub/types';
import { isAnswerCorrect } from '@gcse-hub/shared';
import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { QuestionDiagram } from '../components/questions/QuestionDiagram';
import { SolutionPanel } from '../components/SolutionPanel';
import { useAuth } from '../features/auth/AuthContext';
import { api } from '../lib/api';

type DiagnosticResponse = {
  result: DiagnosticAssessmentSummary;
  learningPath: LearningPathStep[];
};

export function DiagnosticPage() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, DiagnosticAnswerInput>>({});
  const [result, setResult] = useState<DiagnosticResponse | null>(null);
  const [year, setYear] = useState(String(user?.currentYear ?? 8));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function startDiagnostic() {
    setIsLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.get(`/diagnostic-assessment/start?year=${year}&count=20`);
      setQuestions(res.data.data.questions);
      setAnswers({});
    } catch {
      setError('Could not start the diagnostic assessment.');
    } finally {
      setIsLoading(false);
    }
  }

  async function submitDiagnostic() {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.post('/diagnostic-assessment/submit', {
        year: Number(year),
        questions,
        answers: Object.values(answers),
      });
      setResult(res.data.data);
    } catch {
      setError('Could not submit the diagnostic assessment.');
    } finally {
      setIsLoading(false);
    }
  }

  function updateAnswer(questionId: string, patch: Partial<DiagnosticAnswerInput>) {
    setAnswers((current) => ({
      ...current,
      [questionId]: {
        questionId,
        answer: current[questionId]?.answer ?? '',
        confidence: current[questionId]?.confidence ?? 'medium',
        ...patch,
      },
    }));
  }

  return (
    <main className="page dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <div className="brand">GCSE Hub</div>
            <h1>Diagnostic assessment</h1>
            <p>Find the student's current working level, likely GCSE grade and best starting topics.</p>
          </div>
          <Link className="btn btn-secondary" to="/dashboard">Back to dashboard</Link>
        </div>

        <section className="card section">
          <div className="builder-grid">
            <label className="field">
              <span>School year</span>
              <select value={year} onChange={(event) => setYear(event.target.value)}>
                {[7, 8, 9, 10, 11].map((item) => <option key={item} value={item}>Year {item}</option>)}
              </select>
            </label>
            <div className="builder-actions">
              <button className="btn btn-primary" onClick={startDiagnostic} disabled={isLoading}>
                {isLoading ? 'Loading…' : 'Start diagnostic'}
              </button>
            </div>
          </div>
          {error && <div className="error-box">{error}</div>}
        </section>

        {questions.length > 0 && !result && (
          <section className="grid">
            {questions.map((question, index) => (
              <article className="child-card" key={question.id}>
                <span className="topic-pill">{question.topic}</span>
                <h3>Question {index + 1}: {question.title}</h3>
                <p>{question.questionText}</p>
                <QuestionDiagram question={question} />
                {question.options?.length ? (
                  <div className="mcq-options">
                    {question.options.map((option) => (
                      <label className="mcq-option" key={option.id}>
                        <input name={`answer-${question.id}`} type="radio" value={option.value} onChange={() => updateAnswer(question.id, { answer: option.value })} />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <input className="diagnostic-input" value={answers[question.id]?.answer ?? ''} onChange={(event) => updateAnswer(question.id, { answer: event.target.value })} placeholder="Type your answer" />
                )}
                <label className="field compact-field">
                  <span>Confidence</span>
                  <select value={answers[question.id]?.confidence ?? 'medium'} onChange={(event) => updateAnswer(question.id, { confidence: event.target.value as DiagnosticAnswerInput['confidence'] })}>
                    <option value="low">Not confident</option>
                    <option value="medium">Somewhat confident</option>
                    <option value="high">Very confident</option>
                  </select>
                </label>
              </article>
            ))}
            <button className="btn btn-primary" onClick={submitDiagnostic} disabled={isLoading || Object.keys(answers).length === 0}>Submit diagnostic</button>
          </section>
        )}

        {result && (
          <section className="grid">
            <article className="card section">
              <h2>Your starting profile</h2>
              <div className="grid grid-3">
                <div className="stat"><span>Current level</span><strong>Year {result.result.currentLevel}</strong></div>
                <div className="stat"><span>Estimated grade</span><strong>{result.result.estimatedGrade}</strong></div>
                <div className="stat"><span>Suggested tier</span><strong>{result.result.suggestedTarget}</strong></div>
              </div>
              <p><strong>Strengths:</strong> {result.result.strengths.join(', ') || 'More evidence needed'}</p>
              <p><strong>Focus areas:</strong> {result.result.weaknesses.join(', ') || 'Keep building mixed fluency'}</p>
              <ul>{result.result.recommendations.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>

            <article className="card section">
              <h2>Recommended learning path</h2>
              <div className="grid">
                {result.learningPath.map((step) => (
                  <div className="child-card" key={step.id}>
                    <span className="topic-pill">{step.recommendedMode}</span>
                    <h3>{step.title}</h3>
                    <p>{step.topic} · {step.skill} · {step.estimatedMinutes} minutes</p>
                    <Link className="btn btn-secondary" to={`/practice?topic=${encodeURIComponent(step.topic)}&mode=${step.recommendedMode === 'test' ? 'topic-test' : 'practice'}&count=10`}>Start</Link>
                  </div>
                ))}
              </div>
            </article>

            <article className="card section">
              <h2>Review answers</h2>
              {questions.map((question, index) => {
                const submitted = answers[question.id]?.answer ?? '';
                const correct = isAnswerCorrect(submitted, question.answer);
                return (
                  <div className={correct ? 'success-box' : 'error-box'} key={question.id}>
                    <h4>Question {index + 1}: {correct ? 'Correct' : 'Needs work'}</h4>
                    <p>Your answer: {submitted || '-'}</p>
                    <p>Correct answer: <strong>{question.answer}</strong></p>
                    <SolutionPanel solution={question.solution} />
                  </div>
                );
              })}
            </article>
          </section>
        )}
      </div>
    </main>
  );
}
