# GCSE Hub Production Deployment

Recommended free/low-cost deployment stack:

- **Frontend:** Vercel
- **Backend:** Render Web Service
- **Database:** MongoDB Atlas
- **Source control:** GitHub

## 1. GitHub

Push the repository to GitHub:

```bash
git add .
git commit -m "Prepare GCSE Hub for deployment"
git push origin main
```

## 2. MongoDB Atlas

Create a free Atlas cluster and copy the connection string.

Use a database name such as `gcse-hub`:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/gcse-hub?retryWrites=true&w=majority
```

Do not commit this value to GitHub.

## 3. Render API

Create a new **Web Service** from the GitHub repository.

Recommended settings:

```txt
Build Command: yarn install --frozen-lockfile && yarn workspace @gcse-hub/api build
Start Command: yarn workspace @gcse-hub/api start
Health Check Path: /api/health
```

Add environment variables in the Render dashboard:

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

Render free services may sleep after inactivity. The first request after sleep can take longer while the service wakes up.

## 4. Vercel Web

Create a Vercel project from the same GitHub repository.

If deploying from the repository root, use:

```txt
Build Command: yarn workspace @gcse-hub/web build
Output Directory: apps/web/dist
Install Command: yarn install --frozen-lockfile
```

If setting `apps/web` as the Vercel root directory, use:

```txt
Build Command: yarn build
Output Directory: dist
Install Command: yarn install --frozen-lockfile
```

Add this Vercel environment variable:

```env
VITE_API_URL=https://your-render-api.onrender.com/api
```

Then update Render `CLIENT_URL` to your final Vercel URL and redeploy the API.

## 5. Verification

Check:

```txt
https://your-render-api.onrender.com/api/health
https://your-render-api.onrender.com/api/docs
https://your-vercel-app.vercel.app
```

Run locally before deployment:

```bash
yarn install --frozen-lockfile
yarn typecheck
yarn build
```
