<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to improve event reliability. A server-side PostHog client (`lib/posthog-server.ts`) captures events from the API routes. Error tracking is enabled globally via `capture_exceptions: true`.

| Event | Description | File |
|---|---|---|
| `todo_created` | User successfully created a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marked a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marked a completed todo item as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deleted a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: new todo created via API route | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: todo updated via API route | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side: todo deleted via API route | `app/api/todos/[id]/route.ts` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in your PostHog project at https://us.posthog.com/project/238460/dashboards with the following insights:

1. **Todo creations over time** — Trends insight on the `todo_created` event (line graph)
2. **Todo completion rate** — Trends insight comparing `todo_created` vs `todo_completed` (bar graph)
3. **Todo creation → completion funnel** — Funnel insight: `todo_created` → `todo_completed`
4. **Churn signal: Todo deletions** — Trends insight on `todo_deleted` (line graph)
5. **Task completion vs deletion** — Trends insight comparing `todo_completed` vs `todo_deleted` side by side

Navigate to https://us.posthog.com/project/238460 to view your project and create these insights.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
