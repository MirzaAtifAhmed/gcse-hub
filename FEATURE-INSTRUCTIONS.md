# Feature: Dynamic Maths Question Generators

Apply with Merge/Replace after the practice-marking feature.

## Run

```bash
yarn typecheck
yarn build
yarn dev
```

## Included

- Dynamic maths generators
- Algebra expanding brackets
- Ratio sharing
- Probability with dice/cards
- Percentages of amounts
- Full worked solutions
- Mark schemes
- API endpoint for generated practice questions

## API

```text
GET /api/questions/generated-practice?year=8&count=10
```

## Commit

```bash
git add .
git commit -m "feat: add dynamic maths question generators"
```
