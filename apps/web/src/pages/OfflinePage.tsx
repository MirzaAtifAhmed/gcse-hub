import { Link } from 'react-router-dom';

export function OfflinePage() {
  return (
    <main className="form-page">
      <div className="card form status-page-card">
        <h1>You are offline</h1>
        <p>GCSE Hub needs an internet connection for login, practice questions and exam submission.</p>
        <p>Reconnect and refresh the page to continue.</p>
        <Link className="btn btn-primary" to="/dashboard">
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
