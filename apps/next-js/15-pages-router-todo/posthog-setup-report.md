<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes the PostHog JS SDK on the client side using the Next.js 15.3+ `instrumentation-client` pattern. Configured with a reverse proxy (`/ingest`), error exception capture, and debug mode in development.
- **`next.config.ts`** (updated): Added reverse-proxy rewrites for PostHog ingestion (`/ingest/*` → `us.i.posthog.com`) and set `skipTrailingSlashRedirect: true` for PostHog API compatibility.
- **`lib/posthog-server.ts`** (new): Server-side PostHog singleton using `posthog-node`, shared across API route handlers.
- **`components/todos/todo-list.tsx`** (updated): Added client-side event captures for all major user actions plus `captureException` calls on network errors.
- **`pages/api/todos/index.ts`** (updated): Added server-side `todo_created` event on successful POST.
- **`pages/api/todos/[id].ts`** (updated): Added server-side `todo_updated` and `todo_deleted` events on successful PATCH and DELETE operations.
- **`.env.local`** (created): Stores `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | User marks a completed todo item back as active | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server records a new todo being created via the API | `pages/api/todos/index.ts` |
| `todo_updated` | Server records a todo being updated via the API | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server records a todo being deleted via the API | `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/991016)

Suggested insights to add to the dashboard:
1. **Todo Creation Rate** — Trend of `todo_created` over time
2. **Task Completion Funnel** — Funnel from `todo_created` → `todo_completed`
3. **Completion vs Reopening** — Compare `todo_completed` vs `todo_reopened` to identify churn
4. **Todo Deletion Rate** — Trend of `todo_deleted` over time
5. **All Todo Actions** — Breakdown of all `todo_*` events to see overall engagement

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
