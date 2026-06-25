# GCSE Hub

**Your GCSE Journey Starts Here**

Sprint 1 foundation using **Yarn Classic 1.22.22**.

## Setup

```bash
yarn install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
yarn dev
```

Frontend: http://localhost:5173  
API: http://localhost:4404/api/health

## Important

This project uses Yarn Classic workspaces. Do **not** use `workspace:*` dependencies because Yarn 1 does not support that protocol.
