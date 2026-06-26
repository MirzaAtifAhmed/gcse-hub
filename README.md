# 018 - Web MCQ, Diagram and 90 Minute Paper UI

Apply this after `017-real-exam-style-upgrade`.

## What this adds

- Multiple choice answer UI for generated questions
- Simple diagram rendering support for angle/rectangle/circle/triangle/bar/coordinate style questions
- Topic, skill, difficulty, marks and estimated time badges on questions
- 90 minute paper button
- Better exam summary showing total marks and estimated time
- Reuses existing `GeneratedQuestion` type shape from the working project baseline

## Files changed

- `apps/web/src/components/questions/QuestionDiagram.tsx`
- `apps/web/src/pages/DashboardPage.tsx`
- `apps/web/src/styles.css`

## After applying

Run:

```bash
npm run typecheck
npm run build
```
