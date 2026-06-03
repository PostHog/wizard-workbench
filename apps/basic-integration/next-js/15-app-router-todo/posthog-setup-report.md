# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), which sets up client-side analytics, session replay, and error tracking automatically. A reverse proxy is configured in `next.config.ts` to route PostHog requests through `/ingest`, reducing the chance of ad blockers intercepting events. Server-side tracking uses `posthog-node` via a shared client in `lib/posthog-server.ts`. Client and server events are correlated by passing `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers from client fetch calls to each API route.

| Event | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo item from the form | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed by checking its checkbox | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User unmarks a completed todo by unchecking its checkbox | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server confirms a new todo was persisted via POST /api/todos | `app/api/todos/route.ts` |
| `todo_updated` | Server confirms a todo was updated via PATCH /api/todos/[id] | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server confirms a todo was deleted via DELETE /api/todos/[id] | `app/api/todos/[id]/route.ts` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Todo creation trend** — Trends chart for `todo_created` over time, to see how many todos users are adding daily.
2. **Task completion funnel** — Funnel from `todo_created` → `todo_completed`, to measure what percentage of created todos get completed.
3. **Todo completion vs deletion** — Side-by-side trend of `todo_completed` and `todo_deleted`, to understand churn (are users giving up on tasks?).
4. **Completion toggle activity** — Trend of `todo_completed` + `todo_uncompleted`, showing how often users re-open completed tasks.
5. **Server vs client event volume** — Trend comparing client-side `todo_created` with server-side `todo_created`, to monitor any discrepancy between UI and API operations.

Create these insights at: [/insights](/insights)

Build your dashboard at: [/dashboards](/dashboards)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
