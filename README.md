# GCSE Hub

GCSE Hub is a monorepo for an adaptive GCSE learning platform with a React/Vite frontend, Express API, shared packages and MongoDB persistence.

## Tech stack

- Yarn workspaces
- React + Vite frontend: `apps/web`
- Node + Express API: `apps/api`
- MongoDB + Mongoose
- TypeScript shared packages: `packages/types`, `packages/shared`

## Local setup

```bash
yarn install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

Edit `apps/api/.env`:

```env
NODE_ENV=development
PORT=4004
MONGODB_URI=mongodb://127.0.0.1:27017/gcse-hub
JWT_SECRET=gcse-hub-local-development-secret
CLIENT_URL=http://localhost:5173
```

Start MongoDB locally, then run:

```bash
yarn dev
```

Frontend: http://localhost:5173  
API: http://localhost:4004/api/health

## Common commands

```bash
yarn typecheck
yarn build
yarn lint
yarn workspace @gcse-hub/api seed
```

## Deployment

Recommended deployment stack:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Code: GitHub

See [`docs/deployment/Production.md`](docs/deployment/Production.md).

## Environment files

Real `.env` files are ignored by Git. Commit only `.env.example` files.

Required API production variables:

```env
NODE_ENV=production
MONGODB_URI=<MongoDB Atlas URI>
JWT_SECRET=<long random secret>
CLIENT_URL=<Vercel frontend URL>
```

Required web production variable:

```env
VITE_API_URL=<Render API URL>/api
```

## Production checks

- API health: `/api/health`
- API docs: `/api/docs`
- Web PWA manifest: `/manifest.webmanifest`
