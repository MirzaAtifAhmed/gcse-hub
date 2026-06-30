# 027 Intelligent Practice Builder

Adds topic, skill, difficulty, question type, question style and mode filters for maths practice.

## Included

- Practice by topic or mixed topics.
- Optional skill keyword search.
- Question type selector with `All question types` as the default.
- Question style selector with `All styles` as the default.
- Practice modes: practice, topic test, timed test, mastery, exam mode and daily challenge.
- API endpoints:
  - `GET /api/questions/practice-builder-options`
  - `GET /api/questions/intelligent-practice`
- Updated `/practice` page with the builder UI and practice summary.

## Notes

`All question types` creates a balanced mix instead of random questions. If a topic does not currently have enough of a requested type, the engine relaxes the filter to keep the practice set full.
