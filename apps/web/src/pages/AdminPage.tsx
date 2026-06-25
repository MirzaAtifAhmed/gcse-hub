import type { AdminAccountsSummary } from '@gcse-hub/types';
import { useEffect, useState } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { api } from '../lib/api';

export function AdminPage() {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState<AdminAccountsSummary | null>(null);

  useEffect(() => {
    api.get('/admin/accounts').then((res) => setSummary(res.data.data));
  }, []);

  return (
    <main className="page dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <div className="brand">GCSE Hub</div>
            <h1>Admin Console</h1>
            <p>Logged in as {user?.email}</p>
            <p>
              Seed admin login: <strong>admin@gcsehub.local</strong> / <strong>Admin123!</strong>
            </p>
          </div>
          <button className="btn btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>

        {!summary && <div className="card">Loading accounts…</div>}

        {summary && (
          <>
            <section className="grid grid-3">
              <div className="stat">
                <span>Total accounts</span>
                <strong>{summary.totals.all}</strong>
              </div>
              <div className="stat">
                <span>Parents</span>
                <strong>{summary.totals.parents}</strong>
              </div>
              <div className="stat">
                <span>Students / kids</span>
                <strong>{summary.totals.students}</strong>
              </div>
              <div className="stat">
                <span>Admins</span>
                <strong>{summary.totals.admins}</strong>
              </div>
            </section>

            <section className="card section">
              <h2>Accounts</h2>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Year</th>
                      <th>Target</th>
                      <th>Parent</th>
                      <th>Children</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.users.map((account) => (
                      <tr key={account.id}>
                        <td>{account.name}</td>
                        <td>{account.email}</td>
                        <td>{account.role}</td>
                        <td>{account.currentYear ?? '-'}</td>
                        <td>{account.target ?? '-'}</td>
                        <td>{account.parentName ?? '-'}</td>
                        <td>{account.childrenCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
