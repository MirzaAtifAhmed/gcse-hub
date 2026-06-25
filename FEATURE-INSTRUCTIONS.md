# Feature: First Name, Surname and Confirm Password

Apply this on a new feature branch.

## Branch

```bash
git checkout main
git pull
git checkout -b feature/names-confirm-password
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
git commit -m "feat(auth): add first name surname and confirm password fields"
```
