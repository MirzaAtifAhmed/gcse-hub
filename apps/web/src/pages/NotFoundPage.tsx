import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="form-page">
      <div className="card form">
        <h1>Page not found</h1>
        <p>This page does not exist.</p>
        <Link className="btn btn-primary" to="/">Back home</Link>
      </div>
    </main>
  );
}
