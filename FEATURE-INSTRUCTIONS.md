# Feature: Admin Account Overview + API Port 4004

Apply with Merge/Replace.

## Run

```bash
yarn typecheck
yarn build
yarn workspace @gcse-hub/api seed
yarn dev
```

API is now:

```text
http://localhost:4004/api
```

Admin login after seed:

```text
admin@gcsehub.local
Admin123!
```

Commit:

```bash
git add .
git commit -m "feat: add admin account overview and move api to port 4004"
```
