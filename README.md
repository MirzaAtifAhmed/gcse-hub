# Phase 0364 - Frontend status page MongoDB check fix

This patch updates `apps/web/src/pages/SystemStatusPage.tsx` so `/status` checks the MongoDB health endpoint correctly.

## What changed

- Calls `/health/mongo` instead of the generic `/health` endpoint.
- Supports both API base URL formats:
  - `https://gcse-hub.onrender.com`
  - `https://gcse-hub.onrender.com/api`
- Treats any of these as a successful MongoDB connection:
  - `success: true` + `mongoPing: true`
  - `success: true` + `readyState: 1`
  - `success: true` + `database: "connected"`
  - `success: true` + `mongo.connected: true`
- Shows endpoint, ready state, database name, host, and timestamp.

## After applying

Redeploy the frontend on Vercel and open:

```txt
https://gcse-hub-web.vercel.app/status
```

