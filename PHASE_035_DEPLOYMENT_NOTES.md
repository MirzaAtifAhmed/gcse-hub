# Phase 035 – Deployment Readiness v0.95

This phase prepares GCSE Hub for GitHub, Vercel, Render and MongoDB Atlas deployment.

## Added

- Production `.env.example` files for API and web.
- Root `.gitignore` that keeps real secrets out of Git.
- Render `render.yaml` using Yarn.
- Vercel configuration for monorepo/root and `apps/web` deployments.
- MongoDB Atlas deployment guide.
- Detailed `GET /api/health` endpoint with database status.
- `GET /api/docs` lightweight OpenAPI document.
- Production-safe error responses and logging helper.
- Basic in-memory rate limiter for API protection.
- PWA manifest, service worker and app icons.
- SEO metadata, robots.txt and sitemap.xml placeholders.
- Frontend error boundary, offline page and maintenance page.
- GitHub Actions CI workflow using Yarn.
- VS Code API debugging configuration.

## Required hosting environment variables

### Render API

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=<MongoDB Atlas URI>
JWT_SECRET=<openssl rand -hex 32>
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-vercel-app.vercel.app
ADMIN_EMAIL=<admin email>
ADMIN_PASSWORD=<strong password>
```

### Vercel Web

```env
VITE_API_URL=https://your-render-api.onrender.com/api
```

## Check after deployment

- API health: `/api/health`
- API docs: `/api/docs`
- Web app: `/`
- Offline shell: `/offline`
