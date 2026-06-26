import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface TopicCoverageItem {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  status: 'ready' | 'needs-content';
}

export function TopicCoveragePanel({ year }: { year: number }) {
  const [topics, setTopics] = useState<TopicCoverageItem[]>([]);

  useEffect(() => {
    api
      .get(`/topic-coverage?subjectSlug=mathematics&year=${year}`)
      .then((res) => setTopics(res.data.data))
      .catch(() => setTopics([]));
  }, [year]);

  return (
    <section className="card section">
      <h2>Year {year} Maths topic coverage</h2>
      <p className="small-muted">Shows which curriculum areas currently have question content.</p>
      <div className="grid grid-3">
        {topics.map((topic) => (
          <article className="subject-card" key={topic.id}>
            <span className="topic-pill">{topic.status === 'ready' ? 'Ready' : 'Needs content'}</span>
            <h3>{topic.name}</h3>
            <p>{topic.description}</p>
            <strong>{topic.questionCount} seeded question(s)</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
