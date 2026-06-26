import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface MasteryItem {
  id: string;
  topic: string;
  attempts: number;
  masteryPercent: number;
  awardedMarks: number;
  totalMarks: number;
}

export function WeakTopicsPanel() {
  const [items, setItems] = useState<MasteryItem[]>([]);

  useEffect(() => {
    api
      .get('/mastery/me')
      .then((res) => setItems(res.data.data))
      .catch(() => setItems([]));
  }, []);

  return (
    <section className="card section">
      <h2>Weak topics</h2>
      <p className="small-muted">Based on marked practice answers.</p>

      <div className="grid">
        {items.length === 0 && <p>No topic data yet. Complete some practice questions first.</p>}
        {items.slice(0, 5).map((item) => (
          <article className="child-card" key={item.id}>
            <h3>{item.topic}</h3>
            <p>
              Mastery: <strong>{item.masteryPercent}%</strong> · Attempts: {item.attempts}
            </p>
            <div className="progress-bar">
              <span style={{ width: `${item.masteryPercent}%` }} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
