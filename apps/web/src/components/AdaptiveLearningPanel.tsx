import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

type TopicMastery = {
  topic: string;
  masteryPercent: number;
  attempts: number;
  level: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  tutorNudge: string;
};

type Recommendation = {
  title: string;
  topic: string;
  mode: string;
  questionType: string;
  questionStyle: string;
  difficulty: number;
  count: number;
  reason: string;
};

type WeeklyPlanItem = {
  day: string;
  title: string;
  minutes: number;
  mode: string;
};

type AdaptiveLearningDashboard = {
  readiness: {
    score: number;
    message: string;
    estimatedGrade: string;
    evidenceCount: number;
    averageMastery: number;
    examAverage: number;
    nextDifficulty: number;
  };
  topics: TopicMastery[];
  weakTopics: TopicMastery[];
  secureTopics: TopicMastery[];
  recommendations: Recommendation[];
  weeklyPlan: WeeklyPlanItem[];
  tutorSummary: {
    headline: string;
    advice: string;
    nextQuestionPrompt: string;
  };
};

function priorityLabel(priority: TopicMastery['priority']) {
  if (priority === 'high') return 'Focus';
  if (priority === 'medium') return 'Maintain';
  return 'Secure';
}

function practiceLink(recommendation: Recommendation) {
  const params = new URLSearchParams({
    topic: recommendation.topic,
    mode: recommendation.mode,
    questionType: recommendation.questionType,
    questionStyle: recommendation.questionStyle,
    difficulty: String(recommendation.difficulty),
    count: String(recommendation.count),
  });
  return `/practice?${params.toString()}`;
}

export function AdaptiveLearningPanel() {
  const [data, setData] = useState<AdaptiveLearningDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.get('/adaptive-learning/dashboard')
      .then((res) => {
        if (mounted) setData(res.data.data);
      })
      .catch(() => {
        if (mounted) setData(null);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <section className="card section adaptive-panel">
        <h2>Adaptive learning</h2>
        <p>Loading your personalised plan…</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="card section adaptive-panel">
        <h2>Adaptive learning</h2>
        <p>Complete a few practice questions to unlock personalised topic recommendations.</p>
        <Link className="btn btn-primary" to="/practice">Start practice</Link>
      </section>
    );
  }

  return (
    <section className="card section adaptive-panel">
      <div className="section-title compact-title">
        <h2>Adaptive learning</h2>
        <p>{data.readiness.message}</p>
      </div>

      <div className="grid grid-3">
        <div className="stat">
          <span>Readiness</span>
          <strong>{data.readiness.score}%</strong>
        </div>
        <div className="stat">
          <span>Estimated grade</span>
          <strong>{data.readiness.estimatedGrade}</strong>
        </div>
        <div className="stat">
          <span>Next difficulty</span>
          <strong>{data.readiness.nextDifficulty}/5</strong>
        </div>
      </div>

      <div className="adaptive-tutor-card">
        <strong>{data.tutorSummary.headline}</strong>
        <p>{data.tutorSummary.advice}</p>
        <small>{data.tutorSummary.nextQuestionPrompt}</small>
      </div>

      <div className="grid grid-2 section-tight">
        <div>
          <h3>Recommended next practice</h3>
          <div className="grid">
            {data.recommendations.map((item) => (
              <article className="recommendation-card" key={`${item.title}-${item.topic}`}>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.reason}</p>
                </div>
                <Link className="btn btn-secondary" to={practiceLink(item)}>Start</Link>
              </article>
            ))}
          </div>
        </div>

        <div>
          <h3>This week</h3>
          <div className="timeline-list">
            {data.weeklyPlan.map((item) => (
              <div className="timeline-item" key={`${item.day}-${item.title}`}>
                <span>{item.day}</span>
                <strong>{item.title}</strong>
                <small>{item.minutes} mins · {item.mode}</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h3>Topic mastery</h3>
      <div className="mastery-grid">
        {data.topics.slice(0, 10).map((topic) => (
          <div className="mastery-topic-card" key={topic.topic}>
            <div className="mastery-topic-heading">
              <strong>{topic.topic}</strong>
              <span className={`priority-pill priority-${topic.priority}`}>{priorityLabel(topic.priority)}</span>
            </div>
            <div className="progress-bar"><span style={{ width: `${topic.masteryPercent}%` }} /></div>
            <p>{topic.level} · {topic.masteryPercent}% · {topic.attempts} attempts</p>
            <small>{topic.reason}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
