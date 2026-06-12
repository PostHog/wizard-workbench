<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), using a reverse proxy via Next.js rewrites to avoid ad blockers. Server-side event tracking uses `posthog-node` through a shared singleton client in `lib/posthog-server.ts`. Client-side and server-side events are correlated via `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers passed on every API request.

| Event | Description | File |
|---|---|---|
| `todo_created` | Fired on the client when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired on the client when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired on the client when a user marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired on the client when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created_server` | Fired server-side when a new todo is successfully created via the API | `app/api/todos/route.ts` |
| `todo_updated_server` | Fired server-side when a todo is successfully updated via the API | `app/api/todos/[id]/route.ts` |
| `todo_deleted_server` | Fired server-side when a todo is successfully deleted via the API | `app/api/todos/[id]/route.ts` |

## Next steps

The PostHog API key used during setup did not have the required scopes (`dashboard:write`, `insight:write`, `query:read`) to automatically create a dashboard. You can create an "Analytics basics (wizard)" dashboard manually at [PostHog](https://us.posthog.com/project/2/dashboards) with these recommended insights:

- **Todos created over time** — Trends chart of `todo_created` to see creation volume
- **Todo completion rate** — Funnel from `todo_created` → `todo_completed` to measure how often users finish tasks
- **Todo churn** — Trends chart of `todo_deleted` to monitor deletion patterns
- **Task completion vs deletion** — Side-by-side trends of `todo_completed` and `todo_deleted`
- **Server API usage** — Trends of `todo_created_server`, `todo_updated_server`, and `todo_deleted_server` to monitor API health

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
