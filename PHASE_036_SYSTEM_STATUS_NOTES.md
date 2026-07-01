# Phase 036 - Deployment system status page

Adds a public deployment check page for validating that the deployed frontend can reach the API and that the API can reach MongoDB Atlas.

## New URLs

Frontend pages:

- `/status`
- `/system-status`

API endpoint:

- `GET /api/health/mongo`

## What it checks

- Frontend has loaded
- Configured `VITE_API_URL`
- API can be reached
- API process is running
- MongoDB connection state
- MongoDB `admin().ping()` succeeds
- Database name and host returned from Mongoose

## Deployment use

After deploying API on Render and frontend on Vercel:

1. Open `https://your-vercel-app.vercel.app/status`
2. Click **Run check again**
3. Confirm it says **API and MongoDB are working**

If the page says API is not reachable, check `VITE_API_URL` in Vercel.
If the page says MongoDB check failed, check `MONGODB_URI`, Atlas Network Access and Atlas Database Access.
