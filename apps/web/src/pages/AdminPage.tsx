import { useAuth } from '../features/auth/AuthContext';

export function AdminPage() {
  const { user, logout } = useAuth();

  return (
    <main className="page dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <div className="brand">GCSE Hub</div>
            <h1>Admin Console</h1>
            <p>Logged in as {user?.email}</p>
          </div>
          <button className="btn btn-secondary" onClick={logout}>Logout</button>
        </div>

        <div className="card">
          <h2>Platform controls</h2>
          <p>Admin tools for subjects, curriculum, questions and exams will be added in upcoming milestones.</p>
        </div>
      </div>
    </main>
  );
}
