<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Next.js 15 Pages Router Todo application.

**Changes made:**

- **`instrumentation-client.ts`** (new): Initializes posthog-js client-side via Next.js 15.3+ instrumentation, routing traffic through the `/ingest` reverse proxy with exception capture enabled.
- **`next.config.ts`** (updated): Added `rewrites` for PostHog's reverse proxy (`/ingest/*` → `us.i.posthog.com`) and `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node`, configured with `flushAt: 1` / `flushInterval: 0` for immediate flushing in serverless API routes.
- **`components/todos/todo-list.tsx`** (updated): Added four client-side capture calls plus `captureException` in error handlers.
- **`pages/api/todos/index.ts`** (updated): Added server-side `todo_created` event on successful POST.
- **`pages/api/todos/[id].ts`** (updated): Added server-side `todo_updated` and `todo_deleted` events on successful PATCH and DELETE.
- **`.env.local`** (created): Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

| Event | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo (client-side, after API success) | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed via checkbox | `components/todos/todo-list.tsx` |
| `todo_reopened` | User marks a completed todo as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo (client-side, after API success) | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: new todo created via POST /api/todos | `pages/api/todos/index.ts` |
| `todo_updated` | Server-side: todo updated via PATCH /api/todos/[id] | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server-side: todo deleted via DELETE /api/todos/[id] | `pages/api/todos/[id].ts` |

## Next steps

Create an "Analytics basics" dashboard in PostHog with these recommended insights:

1. **Todo creation trend** — Trend of `todo_created` events over time to track user engagement
2. **Completion funnel** — Funnel from `todo_created` → `todo_completed` to measure task completion rate
3. **Deletion rate** — Trend of `todo_deleted` events; high deletion may indicate churn or friction
4. **Reopen rate** — Trend of `todo_reopened` events to understand how often users change their minds
5. **Active users** — Unique users performing `todo_created` per day/week to track retention

Visit [https://us.posthog.com/project/2/insights/new](https://us.posthog.com/project/2/insights/new) to create these insights and add them to a dashboard.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
