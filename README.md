# 019 Fix web styles after 018

Apply this patch after `018-web-mcq-diagram-exam-ui`.

It restores the full global stylesheet and keeps the new 018 MCQ/diagram/exam UI classes as additive styles.

Files changed:

- `apps/web/src/styles.css`

Then run:

```bash
npm run typecheck
npm run build
```
