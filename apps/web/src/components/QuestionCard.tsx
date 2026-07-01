import type { GeneratedQuestion, PracticeAnswerResult } from '@gcse-hub/types';
import { isAnswerCorrect } from '@gcse-hub/shared';
import { type FormEvent, useState } from 'react';
import { SolutionPanel } from './SolutionPanel';
import { QuestionDiagram } from './questions/QuestionDiagram';

type QuestionCardProps = {
  question: GeneratedQuestion;
  index?: number;
  onAnswerChecked?: (question: GeneratedQuestion, answer: string, isCorrect: boolean) => Promise<PracticeAnswerResult | void> | PracticeAnswerResult | void;
};

export function QuestionCard({ question, index, onAnswerChecked }: QuestionCardProps) {
  const [submittedAnswer, setSubmittedAnswer] = useState('');
  const [checked, setChecked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const answer = String(form.get('answer') ?? '').trim();
    const correct = isAnswerCorrect(answer, question.answer);

    setSubmittedAnswer(answer);
    setChecked(true);
    setSaveMessage('');

    if (onAnswerChecked) {
      setIsSaving(true);
      try {
        await onAnswerChecked(question, answer, correct);
        setSaveMessage('Progress saved automatically.');
      } catch {
        setSaveMessage('Answer checked, but progress could not be saved.');
      } finally {
        setIsSaving(false);
      }
    }
  }

  const isCorrect = isAnswerCorrect(submittedAnswer, question.answer);

  return (
    <article className="child-card">
      <span className="topic-pill">{question.topic}</span>
      <h3>
        {index ? `Question ${index}: ` : ''}
        {question.title}
      </h3>
      <p>{question.questionText}</p>
      <QuestionDiagram question={question} />
      <p className="small-muted">
        {question.marks} mark{question.marks === 1 ? '' : 's'} · Difficulty {question.difficulty} · Estimated{' '}
        {Math.max(1, Math.round(question.estimatedSeconds / 60))} min
      </p>

      <form className="answer-form" onSubmit={onSubmit}>
        {question.options && question.options.length > 0 ? (
          <div className="mcq-options">
            {question.options.map((option) => (
              <label className="mcq-option" key={option.id}>
                <input name="answer" type="radio" value={option.value} required />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        ) : (
          <input name="answer" placeholder="Type your answer" required />
        )}
        <button className="btn btn-primary" type="submit" disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Check answer'}
        </button>
      </form>

      {saveMessage && <p className="small-muted">{saveMessage}</p>}

      {checked && (
        <div className={isCorrect ? 'success-box' : 'error-box'}>
          <h4>{isCorrect ? 'Correct' : 'Not quite'}</h4>
          <p>
            Correct answer: <strong>{question.answer}</strong>
          </p>
          <SolutionPanel solution={question.solution} />
        </div>
      )}
    </article>
  );
}
