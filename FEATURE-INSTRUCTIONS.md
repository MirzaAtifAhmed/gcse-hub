# Feature: Child Form First Name, Surname and Confirm Password

Apply this after `feat(auth): add first name surname and confirm password fields`.

## Branch

```bash
git checkout main
git pull
git checkout -b feature/child-form-name-fields
```

## Apply

Extract ZIP using Merge/Replace.

## Run

```bash
yarn typecheck
yarn build
```

## Commit

```bash
git add .
git commit -m "feat(parent): update child form with first name surname and confirm password"
```

## What changes

- Parent Add Child form now sends `firstName`, `surname`, `password`, and `confirmPassword`
- Client-side password mismatch validation
- Error message shown when create child fails
