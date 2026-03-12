<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router Todo App. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog on the client side using Next.js 15.3+ instrumentation. Enables autocapture, session replay, error tracking (`capture_exceptions: true`), and routes PostHog traffic through a reverse proxy at `/ingest`.
- **`next.config.ts`** (updated): Added reverse proxy rewrites for PostHog (`/ingest/*` → PostHog servers) and `skipTrailingSlashRedirect: true` for proper PostHog API request handling.
- **`lib/posthog-server.ts`** (new): Singleton PostHog Node.js client for server-side event tracking in API routes. Uses `flushAt: 1` and `flushInterval: 0` for immediate event flushing in serverless environments.
- **`components/todos/todo-list.tsx`** (updated): Added client-side PostHog event capture for all core todo actions, plus `captureException` calls for error tracking in catch blocks.
- **`pages/api/todos/index.ts`** (updated): Added server-side PostHog event capture for todo creation when a `x-posthog-distinct-id` header is present.
- **`pages/api/todos/[id].ts`** (updated): Added server-side PostHog event capture for todo updates (complete/reopen) and deletion when a `x-posthog-distinct-id` header is present.
- **`.env.local`** (new): Contains `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx`, `pages/api/todos/index.ts` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx`, `pages/api/todos/[id].ts` |
| `todo_reopened` | Fired when a user marks a completed todo as incomplete | `components/todos/todo-list.tsx`, `pages/api/todos/[id].ts` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx`, `pages/api/todos/[id].ts` |

## Next steps

You can build insights and a dashboard in PostHog to monitor user behavior based on the events we just instrumented. Navigate to your PostHog project and create an "Analytics basics" dashboard with insights like:

- **Todos Created Over Time** — Trends for `todo_created` to see new task creation volume
- **Todo Completion Rate** — Funnel from `todo_created` → `todo_completed` to measure engagement
- **Todos Deleted** — Trends for `todo_deleted` to monitor abandoned or unwanted tasks
- **Active vs Completed Ratio** — Compare `todo_completed` vs `todo_reopened` events over time
- **Error Tracking** — Monitor exceptions captured via `captureException` in the error tracking section

Visit your PostHog project at: https://us.posthog.com/project/2

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
