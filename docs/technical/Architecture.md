# Technical Architecture

GCSE Hub uses a Yarn workspace monorepo.

```text
apps/web       React frontend
apps/api       Express API
packages/types Shared TypeScript types
packages/shared Shared constants/utilities
```

The platform is subject-first:

```text
Subject
  Key Stage
    Year Group
      Topic
        Subtopic
          Skill
            Question Template
```
