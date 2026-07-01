# Phase 038 - Simple adaptive practice/test flow

This patch simplifies the practice screen so students and parents do not need to choose many advanced options.

## Changes

- Practice screen now has only the essential choices:
  - Practice or Test
  - Topic
  - Number of questions, including "Recommended for child level"
- Question type is automatically set to `all` for a balanced mix.
- Difficulty is automatically set to `adaptive` using the logged-in student's year level.
- Practice mode has only **Check answer** and automatically saves progress after checking.
- Test mode has no per-question checking. It shows one **Submit test** button at the end and then displays score + worked solutions.
- Removed the confusing second answer box / Save progress form from each practice question.

## Files changed

- `apps/web/src/pages/PracticePage.tsx`
- `apps/web/src/components/QuestionCard.tsx`
- `apps/web/src/styles.css`
