import { Link } from 'react-router-dom';

export function MaintenancePage() {
  return (
    <main className="form-page">
      <div className="card form status-page-card">
        <h1>Maintenance mode</h1>
        <p>GCSE Hub is being updated. Please check back shortly.</p>
        <Link className="btn btn-primary" to="/">
          Back home
        </Link>
      </div>
    </main>
  );
}
