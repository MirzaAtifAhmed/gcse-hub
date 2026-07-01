# GCSE Hub Phase 031-034 Bundle

Built on `gcse-hub-phase-030-profile-learning-settings.zip`.

## Phase 031 — Diagnostic Assessment & Onboarding
- Adds `/api/diagnostic-assessment/start` and `/api/diagnostic-assessment/submit`.
- Adds `/diagnostic` web page.
- Produces estimated grade, current level, suggested tier, strengths, weaknesses and an initial learning path.
- Saves current level, target tier and target grade back to the user profile after submission.

## Phase 032 — Teacher Workspace & Homework Planning
- Adds `/api/teacher-workspace`.
- Adds `/teacher` web page for admin users.
- Provides class summaries, draft homework templates and teacher tool links.

## Phase 033 — Worksheets & Custom Paper Builder
- Adds `/api/worksheets` and `/api/worksheets/custom-paper`.
- Adds `/worksheets` web page.
- Generates printable worksheets, mark schemes and custom mini papers.
- Adds print-friendly CSS.

## Phase 034 — English & Science Starter Expansion
- Adds `/api/subject-expansion` and `/api/subject-expansion/starter-practice`.
- Adds `/subjects` web page.
- Adds starter English and Science practice content while keeping Maths as the mature ready subject.

## Routes added
- Web: `/diagnostic`, `/teacher`, `/worksheets`, `/subjects`.
- API: `/api/diagnostic-assessment`, `/api/teacher-workspace`, `/api/worksheets`, `/api/subject-expansion`.

## Apply / test
```bash
yarn install
yarn typecheck
yarn build
```
