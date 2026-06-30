import type { ExamSubmissionResult } from '@gcse-hub/types';

function groupByTopic(submission: ExamSubmissionResult) {
  const map = new Map<string, { total: number; awarded: number; questions: number }>();

  for (const item of submission.questions) {
    const topic = item.question.topic || 'Mixed practice';
    const current = map.get(topic) ?? { total: 0, awarded: 0, questions: 0 };
    current.total += item.totalMarks;
    current.awarded += item.awardedMarks;
    current.questions += 1;
    map.set(topic, current);
  }

  return Array.from(map.entries()).map(([topic, value]) => ({
    topic,
    ...value,
    percentage: value.total ? Math.round((value.awarded / value.total) * 100) : 0,
  }));
}

export function ExamReviewSummary({ submission }: { submission: ExamSubmissionResult }) {
  const topics = groupByTopic(submission).sort((a, b) => a.percentage - b.percentage);
  const weakest = topics[0];
  const strongest = [...topics].sort((a, b) => b.percentage - a.percentage)[0];

  return (
    <section className="exam-review-card">
      <h3>Exam review</h3>
      <div className="grid grid-3">
        <div className="stat">
          <span>Score</span>
          <strong>{submission.attempt.percentage}%</strong>
        </div>
        <div className="stat">
          <span>Revise next</span>
          <strong>{weakest?.topic ?? 'Mixed practice'}</strong>
        </div>
        <div className="stat">
          <span>Strongest</span>
          <strong>{strongest?.topic ?? 'Keep practising'}</strong>
        </div>
      </div>

      <div className="exam-topic-breakdown detailed-breakdown">
        {topics.map((topic) => (
          <span key={topic.topic}>
            {topic.topic}: {topic.awarded}/{topic.total} marks ({topic.percentage}%)
          </span>
        ))}
      </div>
    </section>
  );
}
