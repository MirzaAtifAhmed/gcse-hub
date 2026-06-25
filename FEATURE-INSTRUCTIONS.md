# Feature Bundle: Parent & Student Management

Apply this bundle on top of your clean `milestone/02-parent-student-curriculum-clean` branch after Step 1 and Step 2 are committed.

## Apply

Extract this ZIP over your current project.

## Run

```bash
yarn typecheck
yarn build
```

If you want the default subjects in MongoDB:

```bash
yarn workspace @gcse-hub/api seed
```

## Commit

```bash
git add .
git commit -m "feat: add parent and student management"
```

## Included

- Parent can add a child/student profile
- Parent can view children
- Parent can promote a child from Year 7 to Year 11
- Dashboard returns children and subject data
- Subject collection and seed script
- Solution-ready question types for the future question engine
