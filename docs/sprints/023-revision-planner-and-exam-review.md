# 023 Revision Planner and Exam Review

Adds the next completion phase on top of the current working project.

## Added

- Student revision planner API: `GET /api/revision-planner/me`
- Weekly revision plan generated from topic mastery, submitted exams and year group
- Student dashboard revision planner panel
- Exam review summary after a paper is submitted
- Topic-level exam breakdown for targeted revision

## Notes

This phase does not change the public shared type contracts. It uses existing models:

- `User`
- `TopicMastery`
- `ExamAttempt`

The revision planner deliberately does not assume `req.user.currentYear` exists. It loads the student from MongoDB using `req.user.id`.
