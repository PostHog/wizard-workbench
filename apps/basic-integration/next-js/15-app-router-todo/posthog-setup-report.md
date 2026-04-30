<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. Here's a summary of all changes made:

**New files created:**
- `instrumentation-client.ts` — Initializes the PostHog JS SDK client-side using Next.js 15.3+'s instrumentation hook. Enables autocapture, session replay, and exception tracking.
- `lib/posthog-server.ts` — Singleton PostHog Node.js client for server-side event capture in API routes.
- `.env.local` — PostHog public key and host configured as environment variables.

**Modified files:**
- `next.config.ts` — Added reverse proxy rewrites for `/ingest/*` → PostHog ingestion endpoints, improving ad-blocker resilience.
- `components/todos/todo-list.tsx` — Added client-side `posthog.capture()` calls and `posthog.captureException()` error tracking.
- `app/api/todos/route.ts` — Added server-side `todo_created` event capture via `posthog-node`.
- `app/api/todos/[id]/route.ts` — Added server-side `todo_updated` and `todo_deleted` event capture via `posthog-node`.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | Fired when a user successfully creates a new todo | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired when a user marks a completed todo as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: fired on POST /api/todos success | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: fired on PATCH /api/todos/[id] success | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side: fired on DELETE /api/todos/[id] success | `app/api/todos/[id]/route.ts` |

## Next steps

We recommend building the following insights and an "Analytics basics" dashboard in PostHog to monitor user behavior:

- [Create "Todo Creation Trend" insight](https://us.posthog.com/project/2/insights/new) — Trend of `todo_created` events over time
- [Create "Task Completion Rate" insight](https://us.posthog.com/project/2/insights/new) — Trend of `todo_completed` events over time
- [Create "Todo Creation → Completion Funnel"](https://us.posthog.com/project/2/insights/new) — Funnel from `todo_created` to `todo_completed`
- [Create "Churn Signal: Todo Deletions"](https://us.posthog.com/project/2/insights/new) — Trend of `todo_deleted` events over time
- [Create "All Todo Actions Overview"](https://us.posthog.com/project/2/insights/new) — Multi-series trend comparing `todo_created`, `todo_completed`, `todo_reopened`, and `todo_deleted`
- [View all dashboards](https://us.posthog.com/project/2/dashboards) — Create a new "Analytics basics" dashboard and add the above insights

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
