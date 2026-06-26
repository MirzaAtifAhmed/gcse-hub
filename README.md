# 003 Forgiving Answer Checker

Add `apps/web/src/utils/answerNormalise.ts` to the project.

Then replace any strict comparison like:

```ts
userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
```

with:

```ts
import { checkMathsAnswer } from '../utils/answerNormalise';

checkMathsAnswer(userAnswer, correctAnswer, {
  requireUnit: false,
  numericTolerance: 0.000001,
}).isCorrect
```

This accepts answers such as:

- `12`, `12cm2`, `12 cm²`, `12 square cm` for `12 cm²`
- `45`, `45°`, `45 degrees`, `45 deg` for `45°`

If the value is correct but the unit is missing, `message` returns a reminder.
