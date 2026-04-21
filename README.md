# hatch-demo-node

Minimal stateful demo for [Hatch](https://hatchpr.dev) preview deployments.

- Node.js + Express API
- PostgreSQL via `pg`
- Register / login endpoints with bcrypt
- `.hatch.yml` declares the multi-service stack (web + db + seed)

Each PR gets its own isolated Postgres instance — no data leaks between previews.

## Local

```bash
docker compose up --build
# → http://localhost:3000
```

## Deploy as PR preview

Open a PR on a branch. Hatch spawns `web` + `db`, runs `seed/preview.sql`, routes the preview URL, and comments it back on the PR.
