# Feature: Maths Practice + Auto Marking Foundation

Apply with Merge/Replace after the admin/port 4004 feature.

## Run

```bash
yarn typecheck
yarn build
yarn workspace @gcse-hub/api seed
yarn dev
```

## Included

- Practice attempt model
- Submit answer endpoint
- Simple automatic marking
- Worked solution returned after marking
- Student practice page section
- Answer input and instant feedback

## API

```text
GET  /api/questions/practice?subjectSlug=mathematics&year=8&limit=5
POST /api/questions/:questionId/answer
```

## Commit

```bash
git add .
git commit -m "feat: add maths practice marking foundation"
```
