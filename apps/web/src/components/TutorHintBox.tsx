import type { GeneratedQuestion } from '@gcse-hub/types';
import { useState } from 'react';
import { api } from '../lib/api';

interface HintResponse {
  title: string;
  hint: string;
  firstStep: string;
  check: string;
  commonMistake: string;
  askYourself: string[];
}

export function TutorHintBox({ question, submittedAnswer }: { question: GeneratedQuestion; submittedAnswer: string }) {
  const [hint, setHint] = useState<HintResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadHint() {
    setLoading(true);
    try {
      const res = await api.post('/tutor/hint', { question, submittedAnswer });
      setHint(res.data.data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tutor-hint-box">
      {!hint && (
        <button className="btn btn-secondary" type="button" onClick={loadHint} disabled={loading}>
          {loading ? 'Loading hint…' : 'Get a guided hint'}
        </button>
      )}
      {hint && (
        <div className="mini-card tutor-hint-card">
          <span className="topic-pill">Tutor hint</span>
          <h4>{hint.title}</h4>
          <p>{hint.hint}</p>
          <p><strong>First step:</strong> {hint.firstStep}</p>
          <p><strong>Check:</strong> {hint.check}</p>
          <p><strong>Common mistake:</strong> {hint.commonMistake}</p>
          <ul>
            {hint.askYourself.map((questionText) => <li key={questionText}>{questionText}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
