# Feature: Exam Generator Foundation

Apply with Merge/Replace after `feat: add dynamic maths question generators`.

## Run

```bash
yarn typecheck
yarn build
yarn dev
```

## Included

- Exam paper type definitions
- Maths exam generator service
- 30, 45 and 60 minute paper generation
- Balanced mixed-topic questions
- Full answer/solution paper included
- API endpoint for generated exams
- Student dashboard exam preview

## API

```text
GET /api/exams/generate?year=8&durationMinutes=60
```

## Commit

```bash
git add .
git commit -m "feat: add exam generator foundation"
```
