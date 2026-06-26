# 021 Adaptive Learning Plan

Apply this patch after `020-gcse-exam-engine-upgrade-fixed.zip`.

## What it adds

- `/api/learning-plan/me` student endpoint.
- Adaptive GCSE learning-plan service based on topic mastery and submitted exams.
- Student dashboard learning plan panel.
- Estimated grade band, weekly goals, next actions, weak topics and strengths.
- Styling for the new learning-plan UI.

## Files changed

- `apps/api/src/app.ts`
- `apps/api/src/services/learningPlanService.ts`
- `apps/api/src/controllers/learningPlanController.ts`
- `apps/api/src/routes/learningPlanRoutes.ts`
- `apps/web/src/components/LearningPlanPanel.tsx`
- `apps/web/src/pages/DashboardPage.tsx`
- `apps/web/src/styles.css`

## After applying

Run:

```bash
npm run typecheck
npm run build
```

If your workspace uses Yarn locally:

```bash
yarn typecheck
yarn build
```
