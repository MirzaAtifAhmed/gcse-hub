# 020 GCSE Exam Engine Upgrade - fixed patch

Apply this after your current working state with patches 017, 018, and the style fix already applied.

This patch is based on the real uploaded repository and contains actual files under both `apps/api` and `apps/web`.

## What changed

- Adds shared tolerant answer checking in `@gcse-hub/shared`:
  - degrees: `79`, `79°`, `79 degree`, `79 degrees`
  - area units: `cm²`, `cm2`, `square cm`, `centimetres squared`
  - money: `£20`, `20`, `20.00`
  - equivalent fractions/decimals where possible
- Wires the API marking service to use the shared checker.
- Wires generated-question UI checking to use the same checker.
- Adds a new GCSE-style generator file with richer questions:
  - sale/voucher percentage problems
  - recipe scaling
  - triangle area with diagram
  - circle area
  - mean from frequency-style data
  - best-value comparison
  - algebra substitution MCQ
- Updates the mixed maths generator to include those richer questions toward the harder end of the paper.
- Adds ratio-bar diagram rendering.
- Restores/keeps web styling and adds diagram/topic-breakdown styles.

## Apply

Copy the folders in this zip into the project root, replacing existing files when prompted.

Then run:

```bash
npm run typecheck
npm run build
```

or with yarn:

```bash
yarn typecheck
yarn build
```
