import type { GeneratedQuestion, PracticeAnswerResult } from '@gcse-hub/types';
import { useState } from 'react';
import { QuestionCard } from '../components/QuestionCard';
import { WeakTopicsPanel } from '../components/WeakTopicsPanel';
import { useAuth } from '../features/auth/AuthContext';
import { api } from '../lib/api';

export function PracticePage() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [topic, setTopic] = useState('');
  const [results, setResults] = useState<Record<string, PracticeAnswerResult>>({});

  async function generatePractice() {
    const year = user?.currentYear ?? 8;
    const topicQuery = topic ? `&topic=${encodeURIComponent(topic)}` : '';
    const res = await api.get(`/questions/generated-practice?year=${year}&count=10${topicQuery}`);
    setQuestions(res.data.data);
    setResults({});
  }

  async function submitToMastery(question: GeneratedQuestion, answer: string) {
    const res = await api.post('/questions/generated-answer', { question, answer });
    setResults((current) => ({ ...current, [question.id]: res.data.data }));
  }

  return (
    <main className="page dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <div className="brand">GCSE Hub</div>
            <h1>Maths Practice</h1>
            <p>Generate mixed or topic-focused questions with full worked solutions.</p>
          </div>
        </div>

        <WeakTopicsPanel />

        <section className="card section">
          <div className="answer-form">
            <select value={topic} onChange={(event) => setTopic(event.target.value)}>
              <option value="">Mixed topics</option>
              <option value="Algebra">Algebra</option>
              <option value="Ratio and Proportion">Ratio</option>
              <option value="Probability">Probability</option>
              <option value="Fractions, Decimals and Percentages">FDP</option>
              <option value="Area">Area</option>
              <option value="Angles">Angles</option>
            </select>
            <button className="btn btn-primary" onClick={generatePractice}>
              Generate practice
            </button>
          </div>
        </section>

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
                <input name="answer" placeholder="Submit to progress tracking" required />
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
