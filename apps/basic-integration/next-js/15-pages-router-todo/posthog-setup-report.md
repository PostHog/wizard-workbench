<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 15 Pages Router todo app with PostHog. Here's a summary of what was set up:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the `instrumentation-client` pattern recommended for Next.js 15.3+. Includes a reverse proxy via `/ingest`, automatic exception capture (`capture_exceptions: true`), and debug mode in development.
- **`next.config.ts`** (updated): Added reverse proxy rewrites for `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*` to route PostHog traffic through your own domain, improving reliability and reducing ad blocker interference. Also set `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new): Singleton PostHog Node.js client for server-side event tracking, configured with `flushAt: 1` and `flushInterval: 0` for immediate event delivery in serverless API routes.
- **`components/todos/todo-list.tsx`** (updated): Added four client-side `posthog.capture()` calls and exception tracking via `posthog.captureException()`.
- **`pages/api/todos/index.ts`** (updated): Added server-side `todo_created` capture on successful POST, using `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to correlate with client-side identity.
- **`pages/api/todos/[id].ts`** (updated): Added server-side `todo_deleted` capture on successful DELETE, using the same identity headers.
- **`.env.local`** (created): `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` set with correct values.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User unmarks a completed todo | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo (client-side) | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: todo created via API | `pages/api/todos/index.ts` |
| `todo_deleted` | Server-side: todo deleted via API | `pages/api/todos/[id].ts` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with these five insights to monitor user behavior:

1. **Todo creation trend** — Trends chart for `todo_created` over time. Helps track overall app usage growth.
2. **Todo completion funnel** — Funnel from `todo_created` → `todo_completed`. Shows what % of created todos get finished.
3. **Todo deletion rate** — Trends chart for `todo_deleted` over time. Signals churn or dissatisfaction.
4. **Completed vs uncompleted toggles** — Stacked trends of `todo_completed` and `todo_uncompleted`. Reveals how often users change their minds.
5. **Active users creating todos** — Unique users triggering `todo_created` over time. Tracks engagement depth.

Create these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
