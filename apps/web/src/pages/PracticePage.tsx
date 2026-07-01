import type { GeneratedQuestion, PracticeAnswerResult } from '@gcse-hub/types';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { QuestionCard } from '../components/QuestionCard';
import { WeakTopicsPanel } from '../components/WeakTopicsPanel';
import { useAuth } from '../features/auth/AuthContext';
import { api } from '../lib/api';

type Option = { value: string; label: string };

type BuilderOptions = {
  topics: Option[];
  difficulties: Option[];
  questionTypes: Option[];
  questionStyles: Option[];
  modes: Option[];
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

const DEFAULT_OPTIONS: BuilderOptions = {
  topics: [
    { value: 'all', label: 'Mixed topics' },
    { value: 'Fractions, Decimals and Percentages', label: 'Fractions, decimals and percentages' },
    { value: 'Algebra', label: 'Algebra' },
    { value: 'Ratio and Proportion', label: 'Ratio and proportion' },
    { value: 'Area', label: 'Area and measures' },
    { value: 'Angles', label: 'Angles and geometry' },
    { value: 'Probability', label: 'Probability' },
  ],
  difficulties: [
    { value: 'adaptive', label: 'Adaptive' },
    { value: 'all', label: 'All difficulties' },
    { value: '1', label: 'Easy' },
    { value: '2', label: 'Easy-medium' },
    { value: '3', label: 'Medium' },
    { value: '4', label: 'Hard' },
    { value: '5', label: 'GCSE challenge' },
  ],
  questionTypes: [
    { value: 'all', label: 'All question types' },
    { value: 'short-answer', label: 'Short answer' },
    { value: 'multiple-choice', label: 'Multiple choice' },
    { value: 'worked', label: 'Worked response' },
    { value: 'diagram', label: 'Diagram questions' },
    { value: 'multi-part', label: 'Multi-part' },
    { value: 'explain', label: 'Explain' },
    { value: 'long-answer', label: 'Long answer' },
  ],
  questionStyles: [
    { value: 'all', label: 'All styles' },
    { value: 'standard', label: 'Standard practice' },
    { value: 'gcse-exam-style', label: 'GCSE exam style' },
    { value: 'real-world', label: 'Real world' },
    { value: 'challenge', label: 'Challenge' },
    { value: 'speed-practice', label: 'Speed practice' },
  ],
  modes: [
    { value: 'practice', label: 'Practice' },
    { value: 'topic-test', label: 'Topic test' },
    { value: 'timed-test', label: 'Timed test' },
    { value: 'mastery', label: 'Mastery mode' },
    { value: 'exam-mode', label: 'Exam mode' },
    { value: 'daily-challenge', label: 'Daily challenge' },
  ],
};

function optionLabel(options: Option[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function PracticePage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [results, setResults] = useState<Record<string, PracticeAnswerResult>>({});
  const [builderOptions, setBuilderOptions] = useState<BuilderOptions>(DEFAULT_OPTIONS);
  const [summary, setSummary] = useState<PracticeSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [topic, setTopic] = useState('all');
  const [skill, setSkill] = useState('');
  const [difficulty, setDifficulty] = useState('adaptive');
  const [questionType, setQuestionType] = useState('all');
  const [questionStyle, setQuestionStyle] = useState('all');
  const [mode, setMode] = useState('practice');
  const [count, setCount] = useState('10');
  const [timed, setTimed] = useState('untimed');


  useEffect(() => {
    const topicParam = searchParams.get('topic');
    const difficultyParam = searchParams.get('difficulty');
    const questionTypeParam = searchParams.get('questionType');
    const questionStyleParam = searchParams.get('questionStyle');
    const modeParam = searchParams.get('mode');
    const countParam = searchParams.get('count');

    if (topicParam) setTopic(topicParam);
    if (difficultyParam) setDifficulty(difficultyParam);
    if (questionTypeParam) setQuestionType(questionTypeParam);
    if (questionStyleParam) setQuestionStyle(questionStyleParam);
    if (modeParam) setMode(modeParam);
    if (countParam) setCount(countParam);
  }, [searchParams]);

  useEffect(() => {
    api.get('/questions/practice-builder-options')
      .then((res) => setBuilderOptions(res.data.data))
      .catch(() => setBuilderOptions(DEFAULT_OPTIONS));
  }, []);

  const selectedDescription = useMemo(() => {
    const parts = [
      optionLabel(builderOptions.topics, topic),
      optionLabel(builderOptions.difficulties, difficulty),
      optionLabel(builderOptions.questionTypes, questionType),
      optionLabel(builderOptions.questionStyles, questionStyle),
      optionLabel(builderOptions.modes, mode),
    ];
    return parts.filter(Boolean).join(' · ');
  }, [builderOptions, difficulty, mode, questionStyle, questionType, topic]);

  async function generatePractice() {
    setIsLoading(true);
    setError('');
    try {
      const year = user?.currentYear ?? 8;
      const params = new URLSearchParams({
        year: String(year),
        count,
        topic,
        difficulty,
        questionType,
        questionStyle,
        mode: timed === 'timed' && mode === 'practice' ? 'timed-test' : mode,
      });

      if (skill.trim()) {
        params.set('skill', skill.trim());
      }

      const res = await api.get(`/questions/intelligent-practice?${params.toString()}`);
      setQuestions(res.data.data.questions);
      setSummary(res.data.data.summary);
      setResults({});
    } catch {
      setError('Could not generate practice. Please try a different topic or difficulty.');
    } finally {
      setIsLoading(false);
    }
  }

  async function submitToMastery(question: GeneratedQuestion, answer: string) {
    const res = await api.post('/questions/generated-answer', { question, answer });
    setResults((current) => ({ ...current, [question.id]: res.data.data }));
  }

  const completed = Object.keys(results).length;
  const correct = Object.values(results).filter((result) => result.isCorrect).length;

  return (
    <main className="page dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <div className="brand">GCSE Hub</div>
            <h1>Intelligent Practice</h1>
            <p>Practise by topic, skill, difficulty and question type. Choose All for a balanced mix.</p>
          </div>
          <div className="nav-actions">
            <Link className="btn btn-secondary" to="/curriculum">Curriculum map</Link>
            <Link className="btn btn-secondary" to="/dashboard">Back to dashboard</Link>
          </div>
        </div>

        <WeakTopicsPanel />

        <section className="card section practice-builder">
          <div className="section-title compact-title">
            <h2>Build your practice</h2>
            <p>{selectedDescription}</p>
          </div>

          <div className="builder-grid">
            <label className="field">
              <span>Topic</span>
              <select value={topic} onChange={(event) => setTopic(event.target.value)}>
                {builderOptions.topics.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
              </select>
            </label>

            <label className="field">
              <span>Skill keyword optional</span>
              <input value={skill} onChange={(event) => setSkill(event.target.value)} placeholder="e.g. percentages, angles, equations" />
            </label>

            <label className="field">
              <span>Difficulty</span>
              <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
                {builderOptions.difficulties.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
              </select>
            </label>

            <label className="field">
              <span>Question type</span>
              <select value={questionType} onChange={(event) => setQuestionType(event.target.value)}>
                {builderOptions.questionTypes.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
              </select>
            </label>

            <label className="field">
              <span>Question style</span>
              <select value={questionStyle} onChange={(event) => setQuestionStyle(event.target.value)}>
                {builderOptions.questionStyles.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
              </select>
            </label>

            <label className="field">
              <span>Mode</span>
              <select value={mode} onChange={(event) => setMode(event.target.value)}>
                {builderOptions.modes.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
              </select>
            </label>

            <label className="field">
              <span>Questions</span>
              <select value={count} onChange={(event) => setCount(event.target.value)}>
                <option value="5">5 questions</option>
                <option value="10">10 questions</option>
                <option value="20">20 questions</option>
                <option value="30">30 questions</option>
                <option value="50">50 questions</option>
              </select>
            </label>

            <label className="field">
              <span>Timing</span>
              <select value={timed} onChange={(event) => setTimed(event.target.value)}>
                <option value="untimed">Untimed</option>
                <option value="timed">Timed</option>
              </select>
            </label>
          </div>

          <div className="builder-actions">
            <button className="btn btn-primary" onClick={generatePractice} disabled={isLoading}>
              {isLoading ? 'Generating…' : mode === 'topic-test' ? 'Generate topic test' : 'Generate practice'}
            </button>
            <button className="btn btn-secondary" onClick={() => { setTopic('all'); setQuestionType('all'); setQuestionStyle('all'); setDifficulty('adaptive'); setMode('practice'); setCount('10'); }}>
              Reset to recommended
            </button>
          </div>

          {error && <p className="error">{error}</p>}
        </section>

        {summary && (
          <section className="card section practice-summary-card">
            <div>
              <h2>{summary.title}</h2>
              <p>{summary.count} questions · {summary.totalMarks} marks · about {summary.estimatedMinutes} minutes</p>
            </div>
            <div className="practice-summary-stats">
              <span>{summary.questionType === 'all' ? 'All types' : summary.questionType}</span>
              <span>{summary.questionStyle === 'all' ? 'All styles' : summary.questionStyle}</span>
              <span>{completed}/{questions.length} completed</span>
              {completed > 0 && <span>{Math.round((correct / completed) * 100)}% correct</span>}
            </div>
          </section>
        )}

        <section className="grid section">
          {questions.map((question, index) => (
            <div key={question.id}>
              <QuestionCard question={question} index={index + 1} />
              <form
                className="answer-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  const form = new FormData(event.currentTarget);
                  submitToMastery(question, String(form.get('answer')));
                }}
              >
                <input name="answer" placeholder="Submit answer to progress tracking" required />
                <button className="btn btn-secondary" type="submit">
                  Save progress
                </button>
              </form>
              {results[question.id] && (
                <p className={results[question.id].isCorrect ? 'success' : 'error'}>
                  Progress saved: {results[question.id].awardedMarks}/{results[question.id].totalMarks}
                </p>
              )}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
