# 017 Real Exam Style Upgrade

Apply this patch on top of the last known working project where the degree/cm² answer checker was fixed.

This patch is intentionally compatible with the existing type model you provided. It does not use the broken V2 type shape from earlier patches.

## Changes

- Keeps existing `@gcse-hub/types` shape and only adds optional support for:
  - multiple-choice options
  - simple diagram specs
  - calculator/exam-style metadata
- Makes exam papers more realistic:
  - 30 minutes: 8 questions
  - 45 minutes: 12 questions
  - 60 minutes: 16 questions
  - 90 minutes: 22 questions
- Adds more multi-step and real-world maths questions.
- Adds progressive difficulty by year.
- Adds multiple-choice support.
- Adds simple SVG rendering for rectangle, angle-line and ratio-bar questions.
- Keeps tolerant marking for degree/cm² answers on both API and web.

## Apply order

Use this as the new clean forward patch instead of old 017-021 patches.

## Check

Run:

```bash
npm run typecheck
npm run build
```
