import type { GeneratedQuestion } from '@gcse-hub/types';
import { useState } from 'react';
import { QuestionCard } from '../components/QuestionCard';
import { useAuth } from '../features/auth/AuthContext';
import { api } from '../lib/api';

export function PracticePage() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [topic, setTopic] = useState('');

  async function generatePractice() {
    const year = user?.currentYear ?? 8;
    const topicQuery = topic ? `&topic=${encodeURIComponent(topic)}` : '';
    const res = await api.get(`/questions/generated-practice?year=${year}&count=10${topicQuery}`);
    setQuestions(res.data.data);
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
            <QuestionCard key={question.id} question={question} index={index + 1} />
          ))}
        </section>
      </div>
    </main>
  );
}
