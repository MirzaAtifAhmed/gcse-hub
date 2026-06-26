# GCSE Hub Feature Branch Workflow

## One branch per feature

```bash
git checkout main
git pull
git checkout -b feature/short-feature-name
```

## Apply ZIP

Use Merge/Replace. Do not replace:

- `.git`
- `.env`
- `node_modules`

## Check

```bash
yarn typecheck
yarn build
```

## Commit

```bash
git add .
git commit -m "feat(scope): clear feature message"
```

## Merge

```bash
git checkout main
git merge feature/short-feature-name
git push origin main
```

## Never commit

- `node_modules`
- `.env`
- `.vite`
- `dist`
- `build`
