<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the Next.js 15.3+ instrumentation pattern. Enables automatic exception capture and session replay. Uses a reverse proxy via `/ingest` to avoid ad-blockers.
- **`next.config.ts`** (updated): Added PostHog reverse proxy rewrites (`/ingest/*` → PostHog ingestion) and `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new): Server-side PostHog singleton using `posthog-node`. Used in API routes for server-side event capture.
- **`components/todos/todo-list.tsx`** (updated): Added client-side event tracking for all todo actions and `captureException` error tracking.
- **`app/api/todos/route.ts`** (updated): Added server-side event tracking when a todo is created.
- **`app/api/todos/[id]/route.ts`** (updated): Added server-side event tracking when a todo is updated or deleted.
- **`.env.local`** (created): Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | User marks a completed todo as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: new todo created via API | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: todo updated via API | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side: todo deleted via API | `app/api/todos/[id]/route.ts` |

## Next steps

To visualize these events, create an **"Analytics basics"** dashboard in PostHog with these suggested insights:

1. **Todo creation rate** — Trend of `todo_created` over time (daily/weekly)
2. **Task completion funnel** — Funnel from `todo_created` → `todo_completed`
3. **Todo lifecycle** — Trend of `todo_created`, `todo_completed`, `todo_reopened`, and `todo_deleted` on one chart
4. **Completion vs. deletion** — `todo_completed` count vs `todo_deleted` count (are users finishing tasks or giving up?)
5. **Active users** — Unique users triggering any todo event per day

Visit [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard) to create the dashboard.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
