import type { PropsWithChildren } from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('Frontend error boundary caught an error', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="form-page">
          <div className="card form status-page-card">
            <h1>Something went wrong</h1>
            <p>Refresh the page or return to the dashboard. If the problem continues, please try again later.</p>
            <div className="nav-links">
              <button className="btn btn-secondary" onClick={() => window.location.reload()} type="button">
                Refresh
              </button>
              <Link className="btn btn-primary" to="/dashboard">
                Go to dashboard
              </Link>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
