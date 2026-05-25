<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. PostHog is now initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route all PostHog traffic through `/ingest`. A shared server-side PostHog client (`lib/posthog-server.ts`) handles event capture from the three API routes. Environment variables are stored in `.env.local`. All client-side user actions (create, complete, reopen, delete) are captured in the `TodoList` component, and the corresponding server-side events are emitted from the API route handlers using the `X-POSTHOG-DISTINCT-ID` header for session correlation when available.

| Event | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo item (client-side) | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | User marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item (client-side) | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: a new todo is persisted via POST /api/todos | `pages/api/todos/index.ts` |
| `todo_updated` | Server-side: a todo is updated via PATCH /api/todos/[id] | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server-side: a todo is removed via DELETE /api/todos/[id] | `pages/api/todos/[id].ts` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these five insights to monitor user behavior:

1. **Todo creations over time** — Trends: `todo_created` event, last 30 days. Shows growth in usage.
2. **Todo completion rate** — Trends: `todo_completed` vs `todo_created`, last 30 days. Core engagement metric.
3. **Todos deleted over time** — Trends: `todo_deleted` event. Tracks churn of task items.
4. **Create → Complete funnel** — Funnel: `todo_created` → `todo_completed`. Measures how many created todos ever get finished.
5. **Reopen rate** — Trends: `todo_reopened` event, last 30 days. Shows recidivism on task completion.

Visit [Dashboards](/dashboard) to create these manually, or [Insights](/insights) to build them one at a time.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
