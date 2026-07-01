# Phase 029 – AI Learning & Adaptive Mastery

Built on top of Phase 028.

## Added

- Adaptive learning dashboard API at `/api/adaptive-learning/dashboard`.
- Rule-based AI-style tutor summary using current topic mastery and recent exams.
- GCSE readiness score and estimated grade band.
- Topic mastery levels: Build confidence, Bronze, Silver, Gold, Platinum and Diamond.
- Weekly adaptive study plan.
- Personalised recommendation cards that link directly into Intelligent Practice.
- Student dashboard panel showing readiness, next difficulty, recommended practice and mastery grid.
- Practice page now reads URL query parameters so recommendation links can prefill topic, mode, style, type and difficulty.

## Files changed

- `apps/api/src/app.ts`
- `apps/api/src/controllers/adaptiveLearningController.ts`
- `apps/api/src/routes/adaptiveLearningRoutes.ts`
- `apps/api/src/services/adaptiveMasteryService.ts`
- `apps/web/src/components/AdaptiveLearningPanel.tsx`
- `apps/web/src/pages/DashboardPage.tsx`
- `apps/web/src/pages/PracticePage.tsx`
- `apps/web/src/styles.css`

## Test

Run:

```bash
yarn typecheck
yarn build
```
