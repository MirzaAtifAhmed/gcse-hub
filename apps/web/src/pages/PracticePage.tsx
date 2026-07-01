import type { GeneratedQuestion, PracticeAnswerResult } from '@gcse-hub/types';
import { isAnswerCorrect } from '@gcse-hub/shared';
import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { QuestionCard } from '../components/QuestionCard';
import { SolutionPanel } from '../components/SolutionPanel';
import { WeakTopicsPanel } from '../components/WeakTopicsPanel';
import { useAuth } from '../features/auth/AuthContext';
import { api } from '../lib/api';

type Option = { value: string; label: string };

type BuilderOptions = {
  topics: Option[];
};

type PracticeSummary = {
  title: string;
  topic: string;
  skill?: string;
  year: number;
  count: number;
  estimatedMinutes: number;
  totalMarks: number;
  questionType: string;
  questionStyle: string;
  mode: string;
};

type SimpleMode = 'practice' | 'topic-test';

type TestSubmission = {
  questionId: string;
  submittedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  awardedMarks: number;
  totalMarks: number;
};

const DEFAULT_TOPICS: Option[] = [
  { value: 'all', label: 'Recommended mixed practice' },
  { value: 'Fractions, Decimals and Percentages', label: 'Fractions, decimals and percentages' },
  { value: 'Algebra', label: 'Algebra' },
  { value: 'Ratio and Proportion', label: 'Ratio and proportion' },
  { value: 'Area', label: 'Area and measures' },
  { value: 'Angles', label: 'Angles and geometry' },
  { value: 'Probability', label: 'Probability' },
  { value: 'Measures', label: 'Measures, speed and units' },
  { value: 'Number', label: 'Number, indices, surds and bounds' },
  { value: 'Statistics', label: 'Statistics and graphs' },
];

const MODE_COPY: Record<SimpleMode, { title: string; description: string; button: string }> = {
  practice: {
    title: 'Practice',
    description: 'Immediate feedback after each question. Progress is saved automatically when you check an answer.',
    button: 'Generate practice',
  },
  'topic-test': {
    title: 'Test',
    description: 'No answers are shown during the test. Submit once at the end to see your score and worked solutions.',
    button: 'Generate test',
  },
};

function optionLabel(options: Option[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

function getRecommendedCount(mode: SimpleMode, year?: number) {
  if (mode === 'practice') return '10';
  if ((year ?? 8) >= 10) return '20';
  return '12';
}

export function PracticePage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [results, setResults] = useState<Record<string, PracticeAnswerResult>>({});
  const [testResults, setTestResults] = useState<TestSubmission[] | null>(null);
  const [builderOptions, setBuilderOptions] = useState<BuilderOptions>({ topics: DEFAULT_TOPICS });
  const [summary, setSummary] = useState<PracticeSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingTest, setIsSubmittingTest] = useState(false);
  const [error, setError] = useState('');

  const [mode, setMode] = useState<SimpleMode>('practice');
  const [topic, setTopic] = useState('all');
  const [count, setCount] = useState('recommended');

  const year = user?.currentYear ?? 8;

  useEffect(() => {
    const topicParam = searchParams.get('topic');
    const modeParam = searchParams.get('mode');
    const countParam = searchParams.get('count');

    if (topicParam) setTopic(topicParam);
    if (modeParam === 'practice' || modeParam === 'topic-test') setMode(modeParam);
    if (countParam) setCount(countParam);
  }, [searchParams]);

  useEffect(() => {
    api.get('/questions/practice-builder-options')
      .then((res) => setBuilderOptions({ topics: res.data.data.topics ?? DEFAULT_TOPICS }))
      .catch(() => setBuilderOptions({ topics: DEFAULT_TOPICS }));
  }, []);

  const selectedDescription = useMemo(() => {
    const topicName = optionLabel(builderOptions.topics, topic);
    const questionCount = count === 'recommended' ? `${getRecommendedCount(mode, year)} questions recommended` : `${count} questions`;
    return `${MODE_COPY[mode].title} · ${topicName} · Year ${year} level · ${questionCount} · All question types`;
  }, [builderOptions.topics, count, mode, topic, year]);

  async function generatePractice() {
    setIsLoading(true);
    setError('');
    setTestResults(null);

    try {
      const resolvedCount = count === 'recommended' ? getRecommendedCount(mode, year) : count;
      const params = new URLSearchParams({
        year: String(year),
        count: resolvedCount,
        topic,
        difficulty: 'adaptive',
        questionType: 'all',
        questionStyle: mode === 'topic-test' ? 'gcse-exam-style' : 'all',
        mode,
      });

      const res = await api.get(`/questions/intelligent-practice?${params.toString()}`);
      setQuestions(res.data.data.questions);
      setSummary(res.data.data.summary);
      setResults({});
    } catch {
      setError('Could not generate questions. Please check the API is running and try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function submitToMastery(question: GeneratedQuestion, answer: string) {
    const res = await api.post('/questions/generated-answer', { question, answer });
    setResults((current) => ({ ...current, [question.id]: res.data.data }));
    return res.data.data;
  }

  async function submitTest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmittingTest(true);
    setError('');

    const form = new FormData(event.currentTarget);
    const submissions: TestSubmission[] = questions.map((question) => {
      const submittedAnswer = String(form.get(`answer-${question.id}`) ?? '').trim();
      const isCorrect = isAnswerCorrect(submittedAnswer, question.answer);
      return {
        questionId: question.id,
        submittedAnswer,
        correctAnswer: question.answer,
        isCorrect,
        awardedMarks: isCorrect ? question.marks : 0,
        totalMarks: question.marks,
      };
    });

    try {
      await Promise.all(
        questions.map((question) => {
          const answer = String(form.get(`answer-${question.id}`) ?? '').trim();
          return answer ? api.post('/questions/generated-answer', { question, answer }) : Promise.resolve();
        }),
      );
      setTestResults(submissions);
    } catch {
      setTestResults(submissions);
      setError('Test marked, but some progress updates could not be saved.');
    } finally {
      setIsSubmittingTest(false);
    }
  }

  const completed = Object.keys(results).length;
  const correct = Object.values(results).filter((result) => result.isCorrect).length;
  const practiceScore = Object.values(results).reduce((sum, result) => sum + result.awardedMarks, 0);
  const practiceTotal = questions.reduce((sum, question) => sum + question.marks, 0);
  const checkedPracticeTotal = Object.values(results).reduce((sum, result) => sum + result.totalMarks, 0);
  const practiceComplete = mode === 'practice' && questions.length > 0 && completed === questions.length;
  const testScore = testResults?.reduce((sum, result) => sum + result.awardedMarks, 0) ?? 0;
  const testTotal = testResults?.reduce((sum, result) => sum + result.totalMarks, 0) ?? 0;
  const testPercentage = testTotal ? Math.round((testScore / testTotal) * 100) : 0;
  const practicePercentage = checkedPracticeTotal ? Math.round((practiceScore / checkedPracticeTotal) * 100) : 0;

  return (
    <main className="page dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <div className="brand">GCSE Hub</div>
            <h1>Practice and tests</h1>
            <p>Choose Practice or Test. GCSE Hub uses the child&apos;s year level and adaptive difficulty automatically.</p>
          </div>
          <div className="nav-actions">
            <Link className="btn btn-secondary" to="/curriculum">Curriculum map</Link>
            <Link className="btn btn-secondary" to="/dashboard">Back to dashboard</Link>
          </div>
        </div>

        <WeakTopicsPanel />

        <section className="card section practice-builder simple-practice-builder">
          <div className="section-title compact-title">
            <h2>Generate work</h2>
            <p>{selectedDescription}</p>
          </div>

          <div className="mode-toggle" role="group" aria-label="Choose practice or test mode">
            {(['practice', 'topic-test'] as SimpleMode[]).map((option) => (
              <button
                className={`mode-card ${mode === option ? 'active' : ''}`}
                key={option}
                type="button"
                onClick={() => {
                  setMode(option);
                  setCount('recommended');
                }}
              >
                <strong>{MODE_COPY[option].title}</strong>
                <span>{MODE_COPY[option].description}</span>
              </button>
            ))}
          </div>

          <div className="builder-grid simple-builder-grid">
            <label className="field">
              <span>Topic</span>
              <select value={topic} onChange={(event) => setTopic(event.target.value)}>
                {builderOptions.topics.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
              </select>
            </label>

            <label className="field">
              <span>Number of questions</span>
              <select value={count} onChange={(event) => setCount(event.target.value)}>
                <option value="recommended">Recommended for child level</option>
                <option value="5">5 questions</option>
                <option value="10">10 questions</option>
                <option value="12">12 questions</option>
                <option value="20">20 questions</option>
                <option value="30">30 questions</option>
              </select>
            </label>
          </div>

          <div className="builder-actions">
            <button className="btn btn-primary" onClick={generatePractice} disabled={isLoading}>
              {isLoading ? 'Generating…' : MODE_COPY[mode].button}
            </button>
            <button className="btn btn-secondary" onClick={() => { setTopic('all'); setMode('practice'); setCount('recommended'); }}>
              Reset to recommended
            </button>
          </div>

          <p className="small-muted">
            Difficulty, question style and question type are selected automatically using the student profile. Question type uses All by default for a balanced mix.
          </p>
          {error && <p className="error">{error}</p>}
        </section>

        {summary && (
          <section className="card section practice-summary-card">
            <div>
              <h2>{summary.title}</h2>
              <p>{summary.count} questions · {summary.totalMarks} marks · about {summary.estimatedMinutes} minutes</p>
            </div>
            <div className="practice-summary-stats">
              <span>Year {summary.year} level</span>
              <span>All question types</span>
              <span>{mode === 'practice' ? `${completed}/${questions.length} checked` : testResults ? 'Test submitted' : 'Ready to start'}</span>
              {mode === 'practice' && completed > 0 && <span>{practiceScore}/{checkedPracticeTotal} marks so far</span>}
              {mode === 'practice' && completed > 0 && <span>{practicePercentage}% score</span>}
              {mode === 'topic-test' && testResults && <span>{testScore}/{testTotal} marks · {testPercentage}%</span>}
            </div>
          </section>
        )}

        {mode === 'practice' && completed > 0 && (
          <section className={`card section score-summary-card ${practiceComplete ? 'complete' : ''}`}>
            <div>
              <p className="small-muted">{practiceComplete ? 'Practice complete' : 'Practice progress'}</p>
              <h2>{practiceScore}/{practiceComplete ? practiceTotal : checkedPracticeTotal} marks</h2>
              <p>
                {practicePercentage}% score · {correct}/{completed} questions correct
                {!practiceComplete && ` · ${questions.length - completed} question${questions.length - completed === 1 ? '' : 's'} left`}
              </p>
            </div>
            <div className="score-breakdown">
              <span>Checked: {completed}/{questions.length}</span>
              <span>Total paper marks: {practiceTotal}</span>
            </div>
          </section>
        )}

        {mode === 'topic-test' && testResults && (
          <section className="card section score-summary-card complete">
            <div>
              <p className="small-muted">Test complete</p>
              <h2>{testScore}/{testTotal} marks</h2>
              <p>{testPercentage}% score · {testResults.filter((result) => result.isCorrect).length}/{testResults.length} questions correct</p>
            </div>
            <div className="score-breakdown">
              <span>{testPercentage >= 80 ? 'Excellent work' : testPercentage >= 60 ? 'Good progress' : 'Keep practising'}</span>
              <span>Review the worked solutions below.</span>
            </div>
          </section>
        )}

        {mode === 'practice' && (
          <section className="grid section">
            {questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index + 1}
                onAnswerChecked={submitToMastery}
              />
            ))}
          </section>
        )}

        {mode === 'topic-test' && questions.length > 0 && (
          <form className="grid section" onSubmit={submitTest}>
            {questions.map((question, index) => {
              const result = testResults?.find((item) => item.questionId === question.id);
              return (
                <article className="child-card" key={question.id}>
                  <span className="topic-pill">{question.topic}</span>
                  <h3>Question {index + 1}: {question.title}</h3>
                  <p>{question.questionText}</p>
                  <p className="small-muted">
                    {question.marks} mark{question.marks === 1 ? '' : 's'} · Difficulty {question.difficulty}
                  </p>

                  {question.options && question.options.length > 0 ? (
                    <div className="mcq-options">
                      {question.options.map((option) => (
                        <label className="mcq-option" key={option.id}>
                          <input name={`answer-${question.id}`} type="radio" value={option.value} required disabled={Boolean(testResults)} />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input name={`answer-${question.id}`} placeholder="Type your answer" required disabled={Boolean(testResults)} />
                  )}

                  {result && (
                    <div className={result.isCorrect ? 'success-box' : 'error-box'}>
                      <h4>{result.isCorrect ? 'Correct' : 'Not quite'}</h4>
                      <p>Your answer: <strong>{result.submittedAnswer || '-'}</strong></p>
                      <p>Correct answer: <strong>{result.correctAnswer}</strong></p>
                      <p>Mark: {result.awardedMarks}/{result.totalMarks}</p>
                      <SolutionPanel solution={question.solution} />
                    </div>
                  )}
                </article>
              );
            })}

            {!testResults && (
              <div className="card test-submit-card">
                <h2>Ready to finish?</h2>
                <p>Submit once at the end. Answers and worked solutions will be shown after marking.</p>
                <button className="btn btn-primary" type="submit" disabled={isSubmittingTest}>
                  {isSubmittingTest ? 'Marking…' : 'Submit test'}
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
