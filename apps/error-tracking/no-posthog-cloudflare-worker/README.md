# cf-worker-hono

Link shortener API on [Cloudflare Workers](https://developers.cloudflare.com/workers/), built with [Hono](https://hono.dev).

## Requirements

- Node.js 24
- npm 11
- A Cloudflare account (for `wrangler dev` and deploys)

## Development

```bash
npm install
npm run dev          # wrangler dev on http://localhost:8787
npm run typecheck
```

Worker configuration lives in `wrangler.toml`. Plain variables go under `[vars]`; secrets are added with `wrangler secret put <NAME>` and, for local development, in `.dev.vars` (git-ignored). Bindings are typed in `src/types.ts`.

## Endpoints

| Method | Path                     | Description                |
| ------ | ------------------------ | -------------------------- |
| GET    | `/`                      | Service info               |
| GET    | `/health`                | Liveness check             |
| GET    | `/api/links`             | List short links           |
| POST   | `/api/links`             | Create `{ "slug", "url" }` |
| GET    | `/api/links/:slug/stats` | Click stats for a link     |
| GET    | `/:slug`                 | Redirect to the target     |

## Build and deploy

```bash
npm run build        # bundle to dist/ without deploying (wrangler deploy --dry-run)
npm run deploy       # wrangler deploy --minify
```

`.github/workflows/deploy.yml` type-checks and builds every push and pull request, and deploys `main` with `cloudflare/wrangler-action`. It needs the `CLOUDFLARE_API_TOKEN` repository secret and the `CLOUDFLARE_ACCOUNT_ID` repository variable.
