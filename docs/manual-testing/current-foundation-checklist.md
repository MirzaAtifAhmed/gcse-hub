# GCSE Hub Manual Testing Checklist

## Setup

```bash
yarn install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
yarn workspace @gcse-hub/api seed
yarn dev
```

Expected:

- Web: `http://localhost:5173`
- API: `http://localhost:4004/api`
- Health: `http://localhost:4004/api/health`

## Admin

Login:

```text
admin@gcsehub.local
Admin123!
```

Expected:

- Admin dashboard loads.
- Account counts display.
- Parent/student/admin table displays.

## Parent

Expected:

- Register as parent.
- Login as parent.
- Dashboard loads.
- Create child profile.
- Child appears under Children.
- Promote year works.
- Child report loads.

## Student

Expected:

- Register as student or login as parent-created child.
- Dashboard loads.
- Generate practice questions.
- Check answer.
- Worked solution displays.
- Generate 30/45/60 minute exam.
- Save answers.
- Submit exam.
- Score displays.
- Report shows submitted exams.

## Do not commit

- `node_modules`
- `.env`
- `.vite`
- `dist`
- `build`
