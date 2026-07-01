# Phase 030 – Profile and Learning Settings

This phase adds editable profile settings so students and parents can configure GCSE Hub's adaptive behaviour instead of relying on hard-coded defaults.

## Added

- `GET /api/profile/me`
- `PATCH /api/profile/me`
- `PATCH /api/children/:childId/profile`
- Student learning profile panel on the dashboard.
- Parent child-profile editor for year, working level, target tier, target grade, exam board and daily study goal.
- New profile fields persisted on the `User` model:
  - `currentLevel`
  - `targetGrade`
  - `examBoard`
  - `studyGoalMinutesPerDay`
  - `learningPreferences`
- Shared types updated with `ProfileSettings`, `ExamBoardPreference` and `LearningPreference`.

## Why

The exam generator, practice builder, revision planner and adaptive learning panels need a reliable source of student configuration. This phase adds that foundation without changing authentication payloads.

## Apply / verify

Run:

```bash
npm run typecheck
npm run build
```

If using MongoDB documents created before this phase, existing users will continue to work because all new fields have safe defaults or are optional.
