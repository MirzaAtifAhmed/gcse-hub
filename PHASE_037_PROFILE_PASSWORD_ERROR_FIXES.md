# Phase 037 – Profile consolidation, password reset and clearer API errors

This patch is based on the latest uploaded project.

## Included

- Removes duplicate editable child learning settings from the Children card.
- Adds a single child Learning Profile page at `/children/:childId/profile`.
- Adds parent reset password flow for child accounts.
- Adds logged-in user password change flow inside the Learning Profile section.
- Adds backend password endpoints:
  - `PATCH /api/auth/password`
  - `PATCH /api/children/:childId/password`
  - `GET /api/children/:childId/profile`
- Improves login/register/create-child errors so API downtime is not shown as invalid credentials or email already registered.
- Adds reusable frontend API error helper.

## After applying

Run:

```bash
yarn install --frozen-lockfile
yarn workspace @gcse-hub/api typecheck
yarn workspace @gcse-hub/web typecheck
yarn workspace @gcse-hub/api build
yarn workspace @gcse-hub/web build
```

Redeploy Render and Vercel after committing.
