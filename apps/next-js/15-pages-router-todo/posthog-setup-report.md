<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side SDK via `posthog-js` using the Next.js 15.3+ `instrumentation-client` pattern. Configured with reverse proxy (`/ingest`), exception capture, and debug mode in development.
- **`next.config.ts`** (updated): Added reverse proxy rewrites for PostHog ingestion (`/ingest/static/*` and `/ingest/*`) and `skipTrailingSlashRedirect: true` to support PostHog's API.
- **`lib/posthog-server.ts`** (new): Server-side PostHog singleton client using `posthog-node`. Shared across API routes for server-side event capture.
- **`components/todos/todo-list.tsx`** (updated): Added client-side event tracking for all CRUD actions. Passes the PostHog `distinct_id` as an `x-posthog-distinct-id` header to correlate client and server events.
- **`pages/api/todos/index.ts`** (updated): Captures `server_todo_created` server-side on successful POST requests.
- **`pages/api/todos/[id].ts`** (updated): Captures `server_todo_completed` on PATCH (when `completed` status changes) and `server_todo_deleted` on DELETE.
- **`.env.local`** (new): Created with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event fired when a new todo is persisted via the API | `pages/api/todos/index.ts` |
| `server_todo_completed` | Server-side event fired when a todo's completed status is toggled via the API | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server-side event fired when a todo is deleted via the API | `pages/api/todos/[id].ts` |

## Next steps

We've instrumented all key user actions. Here are suggested insights to create in PostHog based on the events above:

- **Todo Creation Rate** — Trend of `todo_created` over time (tracks user engagement and app growth)
- **Todo Completion Rate** — Trend of `todo_completed` over time (key engagement metric)
- **Completion Funnel** — Funnel from `todo_created` → `todo_completed` (measures task completion rate)
- **Todo Deletion Rate** — Trend of `todo_deleted` over time (churn signal for tasks)
- **Todo Activity Overview** — All todo events (`todo_created`, `todo_completed`, `todo_uncompleted`, `todo_deleted`) stacked in one view

You can build these insights in PostHog at: https://us.posthog.com/project/2/insights

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
