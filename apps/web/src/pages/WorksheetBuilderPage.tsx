import type { GeneratedExamPaper, WorksheetPack } from '@gcse-hub/types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SolutionPanel } from '../components/SolutionPanel';
import { api } from '../lib/api';

const TOPICS = ['all', 'Algebra', 'Angles', 'Area', 'Probability', 'Ratio and Proportion', 'Fractions, Decimals and Percentages'];

export function WorksheetBuilderPage() {
  const [year, setYear] = useState('8');
  const [topic, setTopic] = useState('all');
  const [count, setCount] = useState('20');
  const [durationMinutes, setDurationMinutes] = useState('45');
  const [worksheet, setWorksheet] = useState<WorksheetPack | null>(null);
  const [paper, setPaper] = useState<GeneratedExamPaper | null>(null);
  const [error, setError] = useState('');

  async function generateWorksheet() {
    setError('');
    setPaper(null);
    try {
      const res = await api.get(`/worksheets?year=${year}&topic=${encodeURIComponent(topic)}&count=${count}&format=both`);
      setWorksheet(res.data.data);
    } catch {
      setError('Could not generate worksheet.');
    }
  }

  async function generateCustomPaper() {
    setError('');
    setWorksheet(null);
    try {
      const res = await api.get(`/worksheets/custom-paper?year=${year}&topics=${encodeURIComponent(topic)}&durationMinutes=${durationMinutes}`);
      setPaper(res.data.data);
    } catch {
      setError('Could not generate custom paper.');
    }
  }

  return (
    <main className="page dashboard">
      <div className="container printable-page">
        <div className="dashboard-header no-print">
          <div>
            <div className="brand">GCSE Hub</div>
            <h1>Worksheet & custom paper builder</h1>
            <p>Generate printable worksheets, mark schemes and tailored mini papers.</p>
          </div>
          <Link className="btn btn-secondary" to="/dashboard">Back to dashboard</Link>
        </div>

        <section className="card section no-print">
          <div className="builder-grid">
            <label className="field"><span>Year</span><select value={year} onChange={(event) => setYear(event.target.value)}>{[7,8,9,10,11].map((item) => <option value={item} key={item}>Year {item}</option>)}</select></label>
            <label className="field"><span>Topic</span><select value={topic} onChange={(event) => setTopic(event.target.value)}>{TOPICS.map((item) => <option value={item} key={item}>{item === 'all' ? 'Mixed topics' : item}</option>)}</select></label>
            <label className="field"><span>Questions</span><select value={count} onChange={(event) => setCount(event.target.value)}>{[10,20,30,40,50].map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
            <label className="field"><span>Paper time</span><select value={durationMinutes} onChange={(event) => setDurationMinutes(event.target.value)}>{[30,45,60,90].map((item) => <option value={item} key={item}>{item} minutes</option>)}</select></label>
          </div>
          <div className="builder-actions">
            <button className="btn btn-primary" onClick={generateWorksheet}>Generate worksheet</button>
            <button className="btn btn-secondary" onClick={generateCustomPaper}>Generate custom paper</button>
            <button className="btn btn-secondary" onClick={() => window.print()}>Print</button>
          </div>
          {error && <div className="error-box">{error}</div>}
        </section>

        {worksheet && (
          <section className="card section worksheet-preview">
            <h2>{worksheet.title}</h2>
            <p>{worksheet.questions.length} questions · {worksheet.totalMarks} marks · {worksheet.estimatedMinutes} minutes</p>
            {worksheet.questions.map(({ number, question }) => (
              <article className="print-question" key={question.id}>
                <h3>{number}. {question.title} <span className="small-muted">[{question.marks} marks]</span></h3>
                <p>{question.questionText}</p>
                <div className="answer-lines" />
              </article>
            ))}
            <h2>Mark scheme</h2>
            {worksheet.questions.map(({ number, question }) => (
              <article className="print-question" key={`${question.id}-mark`}>
                <h3>{number}. {question.answer}</h3>
                <SolutionPanel solution={question.solution} />
              </article>
            ))}
          </section>
        )}

        {paper && (
          <section className="card section worksheet-preview">
            <h2>{paper.title}</h2>
            <p>{paper.questions.length} questions · {paper.totalMarks} marks · {paper.durationMinutes} minutes</p>
            {paper.questions.map((question, index) => (
              <article className="print-question" key={question.id}>
                <h3>{index + 1}. {question.title} <span className="small-muted">[{question.marks} marks]</span></h3>
                <p>{question.questionText}</p>
                <div className="answer-lines" />
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
