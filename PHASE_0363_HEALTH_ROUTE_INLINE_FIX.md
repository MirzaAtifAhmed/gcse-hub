# Phase 036.3 - Health route inline registration fix

This patch makes health endpoints impossible to miss by registering them directly in `apps/api/src/app.ts`.

Endpoints:
- `GET /health`
- `GET /health/db`
- `GET /health/mongo`
- `GET /health/full`
- `GET /api/health`
- `GET /api/health/db`
- `GET /api/health/mongo`
- `GET /api/health/full`

Render Health Check Path should be `/health`.

The web status page now calls `/health` first, which works whether `VITE_API_URL` is the API root or `/api`.
