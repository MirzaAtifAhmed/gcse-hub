import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

type MongoHealthResponse = {
  success?: boolean;
  status?: string;
  service?: string;
  database?: string;
  mongodb?: string;
  mongoPing?: boolean;
  readyState?: number;
  databaseName?: string | null;
  host?: string | null;
  mongo?: {
    connected?: boolean;
    readyState?: number;
    state?: string;
    databaseName?: string | null;
    host?: string | null;
  };
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

function isMongoConnected(data: MongoHealthResponse | null) {
  if (!data) {
    return false;
  }

  return (
    data.success === true &&
    (data.mongoPing === true ||
      data.readyState === 1 ||
      data.database === 'connected' ||
      data.mongodb === 'connected' ||
      data.mongodb === 'ok' ||
      data.mongo?.connected === true ||
      data.mongo?.readyState === 1 ||
      data.mongo?.state === 'connected')
  );
}

export function SystemStatusPage() {
  const [state, setState] = useState<CheckState>('idle');
  const [health, setHealth] = useState<MongoHealthResponse | null>(null);
  const [error, setError] = useState('');
  const [endpoint, setEndpoint] = useState('/health/mongo');

  const apiUrl = useMemo(() => {
    const baseUrl = api.defaults.baseURL ?? '';
    return baseUrl.replace(/\/$/, '');
  }, []);

  async function runCheck() {
    setState('loading');
    setError('');

    try {
      // The API supports both /health/mongo and /api/health/mongo.
      // The axios base URL decides which final URL is used:
      // - VITE_API_URL=https://api.example.com      -> /health/mongo
      // - VITE_API_URL=https://api.example.com/api  -> /api/health/mongo
      const res = await api.get<MongoHealthResponse>('/health/mongo', {
        timeout: 12_000,
        validateStatus: () => true,
      });

      setEndpoint('/health/mongo');
      setHealth(res.data);

      if (res.status >= 200 && res.status < 300 && isMongoConnected(res.data)) {
        setState('online');
      } else if (res.status >= 200 && res.status < 500) {
        setState('degraded');
      } else {
        setState('offline');
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

  const mongoConnected = isMongoConnected(health);
  const databaseName = health?.databaseName ?? health?.mongo?.databaseName ?? '-';
  const host = health?.host ?? health?.mongo?.host ?? '-';
  const readyState = health?.readyState ?? health?.mongo?.readyState;
  const mongoState = health?.database ?? health?.mongodb ?? health?.mongo?.state ?? (mongoConnected ? 'connected' : '-');

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
            <dt>Endpoint</dt>
            <dd>{endpoint}</dd>
          </div>
          <div>
            <dt>API status</dt>
            <dd>{health?.status ?? (state === 'offline' ? 'offline' : '-')}</dd>
          </div>
          <div>
            <dt>MongoDB state</dt>
            <dd>{mongoState}</dd>
          </div>
          <div>
            <dt>MongoDB ping</dt>
            <dd>{mongoConnected ? 'Passed' : health ? 'Failed' : '-'}</dd>
          </div>
          <div>
            <dt>Ready state</dt>
            <dd>{readyState ?? '-'}</dd>
          </div>
          <div>
            <dt>Database</dt>
            <dd>{databaseName}</dd>
          </div>
          <div>
            <dt>Host</dt>
            <dd>{host}</dd>
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
