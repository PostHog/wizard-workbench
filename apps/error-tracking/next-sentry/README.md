# Ledgerly

Invoice tracking and revenue reports for small teams. Built with Next.js (App Router).

## Getting started

```bash
cp .env.example .env.local   # fill in the values
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command         | What it does                       |
| --------------- | ---------------------------------- |
| `npm run dev`   | Start the dev server               |
| `npm run build` | Production build                   |
| `npm start`     | Serve the production build         |
| `npm run lint`  | Run ESLint                         |

## Monitoring

- Errors and performance go to Sentry. Configuration lives in `sentry.*.config.ts`,
  `instrumentation.ts` and `instrumentation-client.ts`. Source maps are uploaded
  during `npm run build` when `SENTRY_AUTH_TOKEN` is set.
- Product analytics go to PostHog (`NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`).

## Deployment

Pushes to `main` are built and deployed to Vercel by `.github/workflows/deploy.yml`.
