import type { GeneratedQuestion } from '@gcse-hub/types';
import { type FormEvent, useState } from 'react';
import { SolutionPanel } from './SolutionPanel';

function normalise(value: string) {
  return value.toLowerCase().replace(/\s+/g, '').replace(/£/g, '').replace(/,/g, '');
}

export function QuestionCard({ question, index }: { question: GeneratedQuestion; index?: number }) {
  const [submittedAnswer, setSubmittedAnswer] = useState('');
  const [checked, setChecked] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmittedAnswer(String(form.get('answer')));
    setChecked(true);
  }

  const isCorrect = normalise(submittedAnswer) === normalise(question.answer);

  return (
    <article className="child-card">
      <span className="topic-pill">{question.topic}</span>
      <h3>
        {index ? `Question ${index}: ` : ''}
        {question.title}
      </h3>
      <p>{question.questionText}</p>
      <p className="small-muted">
        {question.marks} marks · Difficulty {question.difficulty} · {question.estimatedSeconds}s
      </p>

      <form className="answer-form" onSubmit={onSubmit}>
        <input name="answer" placeholder="Type your answer" required />
        <button className="btn btn-primary" type="submit">
          Check
        </button>
      </form>

      {checked && (
        <div className={isCorrect ? 'success-box' : 'error-box'}>
          <h4>{isCorrect ? 'Correct' : 'Not quite'}</h4>
          <p>
            Your answer: <strong>{submittedAnswer}</strong>
          </p>
          <p>
            Correct answer: <strong>{question.answer}</strong>
          </p>
        </div>
      )}

      {checked && <SolutionPanel solution={question.solution} />}
    </article>
  );
}
