import { Link } from 'react-router-dom';

const curriculum = [
  {
    strand: 'Number',
    topics: ['Place value', 'Four operations', 'Fractions', 'Decimals', 'Percentages', 'Standard form', 'Indices', 'Surds', 'Bounds'],
  },
  {
    strand: 'Algebra',
    topics: ['Expressions', 'Expanding brackets', 'Factorising', 'Linear equations', 'Sequences', 'Quadratics', 'Simultaneous equations', 'Inequalities'],
  },
  {
    strand: 'Ratio and proportion',
    topics: ['Ratio sharing', 'Recipes', 'Scale drawings', 'Direct proportion', 'Inverse proportion', 'Percentage change'],
  },
  {
    strand: 'Geometry and measures',
    topics: ['Angles', 'Polygons', 'Area', 'Circle area', 'Volume', 'Pythagoras', 'Bearings', 'Transformations', 'Circle theorems'],
  },
  {
    strand: 'Statistics and probability',
    topics: ['Averages', 'Frequency tables', 'Scatter graphs', 'Histograms', 'Probability trees', 'Venn diagrams'],
  },
];

const yearProgression = [
  { year: 'Year 7', focus: 'Fluency, basic number, simple algebra, angles and area.' },
  { year: 'Year 8', focus: 'Two-step methods, ratio, sequences, transformations and statistics.' },
  { year: 'Year 9', focus: 'GCSE-style wording begins with multi-step number, algebra and geometry.' },
  { year: 'Year 10', focus: 'Foundation/Higher GCSE skills: quadratics, proportion, Pythagoras, probability.' },
  { year: 'Year 11', focus: 'Exam-standard reasoning, challenge questions, mixed-topic papers and mastery.' },
];

export function CurriculumPage() {
  return (
    <main className="page dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <div className="brand">GCSE Hub</div>
            <h1>Maths Curriculum</h1>
            <p>Track the Year 7 to GCSE journey and choose targeted practice by topic, skill and question type.</p>
          </div>
          <Link className="btn btn-secondary" to="/practice">Practice by topic</Link>
        </div>

        <section className="grid grid-3 section">
          {yearProgression.map((item) => (
            <article className="card curriculum-year-card" key={item.year}>
              <span className="topic-pill">{item.year}</span>
              <h3>{item.focus}</h3>
            </article>
          ))}
        </section>

        <section className="card section">
          <div className="section-title compact-title">
            <h2>Complete GCSE Maths coverage</h2>
            <p>Each strand contains Learn, Worked Example, Practice, Topic Test, Exam Questions and Mastery mode.</p>
          </div>
          <div className="curriculum-grid">
            {curriculum.map((strand) => (
              <article className="curriculum-strand" key={strand.strand}>
                <h3>{strand.strand}</h3>
                <div className="topic-chip-list">
                  {strand.topics.map((topic) => <span className="topic-pill" key={topic}>{topic}</span>)}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
