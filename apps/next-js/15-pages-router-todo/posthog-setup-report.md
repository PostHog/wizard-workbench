<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router Todo app. The following changes were made:

- **`instrumentation-client.ts`** (new): Client-side PostHog initialization using the Next.js 15.3+ `instrumentation-client` convention. Configured with a reverse proxy via `/ingest`, error tracking (`capture_exceptions`), and debug mode in development.
- **`next.config.ts`**: Added reverse proxy rewrites for `/ingest` → PostHog US ingestion, plus `skipTrailingSlashRedirect: true` for PostHog compatibility.
- **`lib/posthog-server.ts`** (new): Singleton `posthog-node` client for server-side event capture in API routes. Uses `flushAt: 1` and `flushInterval: 0` to ensure events are sent immediately in serverless API route context.
- **`components/todos/todo-list.tsx`**: Added client-side capture for all four core todo actions. PostHog `distinct_id` and `session_id` are forwarded as request headers (`X-POSTHOG-DISTINCT-ID`, `X-POSTHOG-SESSION-ID`) so server-side events can be correlated to the same user session. Added `captureException` on API call errors.
- **`pages/api/todos/index.ts`**: Added server-side `todo_created` event after successful POST, using the distinct ID forwarded from the client.
- **`pages/api/todos/[id].ts`**: Added server-side `todo_updated` and `todo_deleted` events after successful PATCH and DELETE, using the distinct ID forwarded from the client.
- **`.env.local`**: Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

| Event | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo (client) | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed (client) | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo as not completed (client) | `components/todos/todo-list.tsx` |
| `todo_deleted` | User successfully deletes a todo (client) | `components/todos/todo-list.tsx` |
| `todo_created` | New todo created via POST API (server) | `pages/api/todos/index.ts` |
| `todo_updated` | Todo updated via PATCH API (server) | `pages/api/todos/[id].ts` |
| `todo_deleted` | Todo deleted via DELETE API (server) | `pages/api/todos/[id].ts` |

## Next steps

We recommend setting up an **"Analytics basics"** dashboard in PostHog with these five insights to monitor user behavior:

1. **Todo Creations Over Time** — Trend of `todo_created` events. Tracks how many tasks users create per day/week.
2. **Task Completion Funnel** — Funnel from `todo_created` → `todo_completed`. Shows what percentage of created todos get completed.
3. **Todo Deletions Over Time** — Trend of `todo_deleted` events. High deletion rates without completion may signal UX friction.
4. **Completed vs Uncompleted Toggles** — Breakdown of `todo_completed` vs `todo_uncompleted` events. Shows how often users change their mind.
5. **Active Users (WAU/DAU)** — Unique users firing any todo event (`todo_created`, `todo_completed`, `todo_deleted`). Tracks overall engagement.

Create your dashboard here: https://us.posthog.com/project/238460/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
