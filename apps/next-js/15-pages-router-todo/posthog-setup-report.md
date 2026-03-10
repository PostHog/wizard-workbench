<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router todo application. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to improve reliability. A server-side PostHog client in `lib/posthog-server.ts` enables tracking of API route events. Four key user action events are captured on both the client and server side, and unhandled exceptions in the todo mutation handlers are captured via `posthog.captureException`.

| Event Name | Description | File(s) |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx`, `pages/api/todos/index.ts` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx`, `pages/api/todos/[id].ts` |
| `todo_reopened` | Fired when a user marks a completed todo as incomplete | `components/todos/todo-list.tsx`, `pages/api/todos/[id].ts` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx`, `pages/api/todos/[id].ts` |

## Next steps

To view your analytics, log in to PostHog and create an "Analytics basics" dashboard. Suggested insights to add:

- **Todo creation trend** — Trends chart for `todo_created` over time
- **Todo completion funnel** — Funnel: `todo_created` → `todo_completed`
- **Completion vs. deletion rate** — Trends chart comparing `todo_completed` and `todo_deleted`
- **Todo churn signal** — Trends chart for `todo_deleted` over time
- **Reopened todos** — Trends chart for `todo_reopened` (indicates dissatisfaction with completions)

Log in at: https://us.posthog.com/project/2

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
