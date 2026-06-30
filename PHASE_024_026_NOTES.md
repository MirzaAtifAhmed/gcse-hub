# GCSE Hub phases 024–026

This build is based on the uploaded working project and adds the next three completion phases in one integrated update.

## Phase 024 — GCSE maths depth

- Added additional GCSE-style question generators:
  - speed/distance/time
  - Pythagoras
  - reverse percentages
  - simultaneous equations
  - probability without replacement
  - bounds/error intervals
- Wired the new generators into the mixed maths generator so papers become more varied and more exam-like as students progress through Years 9–11.

## Phase 025 — Guided tutor hints

- Added `/api/tutor/hint`.
- Added a tutor hint service that gives a first step, common mistake, answer interpretation and guiding questions.
- Added a web `TutorHintBox` that appears for incorrect generated practice/exam answers.

## Phase 026 — Insights and readiness

- Added `/api/insights/me` for student GCSE readiness.
- Added `/api/insights/parent` for parent-level child progress summaries.
- Added student and parent insight panels to the dashboard.
- Exam submissions now update topic mastery, not only quick practice.

## Notes

- Existing type contracts are preserved.
- Existing auth shape is preserved; controllers do not assume `req.user.currentYear`.
- Existing CSS has only been appended to, not replaced.

## Suggested verification

Run from the project root:

```bash
yarn install
yarn typecheck
yarn build
```

Then test:

1. Login as a student.
2. Open dashboard.
3. Generate quick practice.
4. Submit an incorrect answer and request a guided hint.
5. Generate and submit a paper.
6. Check that insights and learning plan panels update after practice/exam submissions.
7. Login as a parent and verify the family progress overview.
