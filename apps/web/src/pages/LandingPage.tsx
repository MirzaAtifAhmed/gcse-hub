import { APP_NAME, APP_TAGLINE } from '@gcse-hub/shared';
import { BookOpen, Brain, LineChart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <main className="page">
      <div className="container">
        <nav className="nav">
          <div className="brand">{APP_NAME}</div>
          <div className="nav-links">
            <Link className="btn btn-secondary" to="/login">Login</Link>
            <Link className="btn btn-primary" to="/register">Get started</Link>
          </div>
        </nav>

        <section className="hero">
          <div>
            <h1>{APP_TAGLINE}</h1>
            <p>
              A future-ready GCSE learning platform for Year 7 to Year 11 students. Start with
              Maths, then expand into English, Science and more.
            </p>
            <div className="nav-links">
              <Link className="btn btn-primary" to="/register">Create account</Link>
              <Link className="btn btn-secondary" to="/login">Student or parent login</Link>
            </div>
          </div>

          <div className="card grid">
            <div className="subject-card"><BookOpen size={28} /><h3>Curriculum driven</h3><p>Subjects, years, topics and skills are configurable.</p></div>
            <div className="subject-card"><Brain size={28} /><h3>Adaptive practice</h3><p>Students revise weaker areas while building broad GCSE confidence.</p></div>
            <div className="subject-card"><LineChart size={28} /><h3>Parent reports</h3><p>Track accuracy, time taken and topic progress.</p></div>
            <div className="subject-card"><Users size={28} /><h3>Built to grow</h3><p>Start with Maths, then add other GCSE subjects later.</p></div>
          </div>
        </section>
      </div>
    </main>
  );
}
