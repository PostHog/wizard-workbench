<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router Todo application. The following changes were made:

- **`instrumentation-client.ts`** (new) — Client-side PostHog initialization using `posthog.init()` with reverse proxy, exception capturing, and debug mode in development.
- **`lib/posthog-server.ts`** (new) — Server-side PostHog singleton client using `posthog-node` for capturing events from API routes.
- **`next.config.ts`** — Added reverse proxy rewrites (`/ingest/*`) and `skipTrailingSlashRedirect: true` for reliable PostHog ingestion.
- **`.env.local`** — Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.
- **`components/todos/todo-list.tsx`** — Added client-side `posthog.capture()` calls for `todo_created`, `todo_completed`, `todo_uncompleted`, and `todo_deleted` events, plus `posthog.captureException()` in error handlers.
- **`app/api/todos/route.ts`** — Added server-side `todo_created` capture in the POST handler.
- **`app/api/todos/[id]/route.ts`** — Added server-side `todo_updated` capture in the PATCH handler and `todo_deleted` capture in the DELETE handler.

| Event | Description | File |
|---|---|---|
| `todo_created` | A new todo item was successfully created by the user | `components/todos/todo-list.tsx` |
| `todo_completed` | A todo item was marked as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | A completed todo item was marked as not completed | `components/todos/todo-list.tsx` |
| `todo_deleted` | A todo item was deleted by the user | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: a new todo was persisted via the POST API route | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: a todo was updated via the PATCH API route | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side: a todo was deleted via the DELETE API route | `app/api/todos/[id]/route.ts` |

## Next steps

To monitor user behavior, we recommend building an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Todo creation rate** — Trend of `todo_created` events over time
2. **Task completion funnel** — Funnel from `todo_created` → `todo_completed`
3. **Deletion rate** — Trend of `todo_deleted` events over time
4. **Completion vs uncomplete toggles** — Breakdown of `todo_completed` vs `todo_uncompleted`
5. **Active vs completed task ratio** — Compare `todo_created` minus `todo_deleted` over time

You can create this dashboard at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
