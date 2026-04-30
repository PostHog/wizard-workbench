<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 Pages Router Todo application. Here's a summary of all changes made:

**New files created:**
- `instrumentation-client.ts` — Client-side PostHog initialization using the Next.js 15.3+ instrumentation API. Configures the reverse proxy host (`/ingest`), enables exception capture, and turns on debug mode in development.
- `lib/posthog-server.ts` — Singleton server-side PostHog client using `posthog-node`. Used by API routes for server-side event tracking.
- `.env.local` — Environment variables for `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

**Modified files:**
- `next.config.ts` — Added reverse proxy rewrites for `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*` to route PostHog requests through your own domain, plus `skipTrailingSlashRedirect: true`.
- `components/todos/todo-list.tsx` — Added client-side PostHog event captures and `captureException` error tracking in all CRUD handlers.
- `pages/api/todos/index.ts` — Added server-side PostHog capture for `api_todo_created` on successful POST.
- `pages/api/todos/[id].ts` — Added server-side PostHog capture for `api_todo_updated` (PATCH) and `api_todo_deleted` (DELETE).

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User successfully creates a new todo | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | User marks a completed todo as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `api_todo_created` | Server-side: new todo persisted via POST /api/todos | `pages/api/todos/index.ts` |
| `api_todo_updated` | Server-side: todo updated via PATCH /api/todos/[id] | `pages/api/todos/[id].ts` |
| `api_todo_deleted` | Server-side: todo deleted via DELETE /api/todos/[id] | `pages/api/todos/[id].ts` |

## Next steps

We've prepared a set of recommended insights for your "Analytics basics" dashboard. Create it here and add these insights:

- **[New dashboard: Analytics basics](https://us.posthog.com/project/2/dashboard/new)**

Recommended insights to add:

1. **Todo creations over time** — Trend of `todo_created` events (daily/weekly volume)
   [Create insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo_created","name":"todo_created","type":"events","order":0}]})

2. **Todo completion funnel** — Funnel from `todo_created` → `todo_completed` to measure how many todos get finished
   [Create insight](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"todo_created","name":"todo_created","type":"events","order":0},{"id":"todo_completed","name":"todo_completed","type":"events","order":1}]})

3. **Todo deletion rate** — Trend of `todo_deleted` events to track churn of tasks
   [Create insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo_deleted","name":"todo_deleted","type":"events","order":0}]})

4. **Completions vs. reopens** — Side-by-side trend of `todo_completed` vs `todo_reopened` to measure productivity patterns
   [Create insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo_completed","name":"todo_completed","type":"events","order":0},{"id":"todo_reopened","name":"todo_reopened","type":"events","order":1}]})

5. **Active users (unique todo creators)** — Unique users who fired `todo_created` over time
   [Create insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo_created","name":"todo_created","type":"events","order":0,"math":"dau"}]})

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
