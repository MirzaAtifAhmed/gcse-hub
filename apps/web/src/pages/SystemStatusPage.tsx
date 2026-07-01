import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

type HealthResponse = {
  success: boolean;
  status: string;
  service?: string;
  version?: string;
  environment?: string;
  database?: string;
  mongoPing?: boolean;
  databaseName?: string;
  host?: string;
  message?: string;
  timestamp?: string;
};

type CheckState = 'idle' | 'loading' | 'online' | 'degraded' | 'offline';

function formatDate(value?: string) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(new Date(value));
}

export function SystemStatusPage() {
  const [state, setState] = useState<CheckState>('idle');
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState('');

  const apiUrl = useMemo(() => {
    const baseUrl = api.defaults.baseURL ?? '';
    return baseUrl.replace(/\/$/, '');
  }, []);

  async function runCheck() {
    setState('loading');
    setError('');

    try {
      const res = await api.get<HealthResponse>('/health/mongo', {
        timeout: 12_000,
        validateStatus: () => true,
      });

      setHealth(res.data);

      if (res.status >= 200 && res.status < 300 && res.data.success && res.data.mongoPing) {
        setState('online');
      } else {
        setState('degraded');
      }
    } catch (err) {
      setHealth(null);
      setState('offline');
      setError(err instanceof Error ? err.message : 'Could not reach the API.');
    }
  }

  useEffect(() => {
    runCheck();
  }, []);

  const statusLabel =
    state === 'online'
      ? 'API and MongoDB are working'
      : state === 'degraded'
        ? 'API responded, but MongoDB check failed'
        : state === 'offline'
          ? 'API is not reachable'
          : state === 'loading'
            ? 'Checking API and MongoDB…'
            : 'Ready to check';

  return (
    <main className="form-page system-status-page">
      <div className="card form status-page-card system-status-card">
        <p className="eyebrow">Deployment check</p>
        <h1>GCSE Hub system status</h1>
        <p>
          This page checks whether the frontend can reach the API and whether the API can ping MongoDB.
        </p>

        <div className={`system-status-banner system-status-${state}`}>
          <strong>{statusLabel}</strong>
          {error && <span>{error}</span>}
          {health?.message && <span>{health.message}</span>}
        </div>

        <dl className="system-status-grid">
          <div>
            <dt>Frontend</dt>
            <dd>Loaded</dd>
          </div>
          <div>
            <dt>API URL</dt>
            <dd>{apiUrl}</dd>
          </div>
          <div>
            <dt>API status</dt>
            <dd>{health?.status ?? (state === 'offline' ? 'offline' : '-')}</dd>
          </div>
          <div>
            <dt>MongoDB state</dt>
            <dd>{health?.database ?? '-'}</dd>
          </div>
          <div>
            <dt>MongoDB ping</dt>
            <dd>{health?.mongoPing ? 'Passed' : health ? 'Failed' : '-'}</dd>
          </div>
          <div>
            <dt>Database</dt>
            <dd>{health?.databaseName ?? '-'}</dd>
          </div>
          <div>
            <dt>Host</dt>
            <dd>{health?.host ?? '-'}</dd>
          </div>
          <div>
            <dt>Checked at</dt>
            <dd>{formatDate(health?.timestamp)}</dd>
          </div>
        </dl>

        <div className="nav-links">
          <button className="btn btn-primary" type="button" onClick={runCheck} disabled={state === 'loading'}>
            {state === 'loading' ? 'Checking…' : 'Run check again'}
          </button>
          <Link className="btn btn-secondary" to="/">
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
