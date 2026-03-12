<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. The integration includes client-side initialization via `instrumentation-client.ts`, a reverse proxy configuration in `next.config.ts`, a server-side PostHog client in `lib/posthog-server.ts`, and event tracking across all key user actions. Client and server events are correlated via the `x-posthog-distinct-id` header passed from the browser to each API route.

| Event Name | Description | File |
|---|---|---|
| `todo_list_viewed` | User viewed the main todo list page (top of conversion funnel) | `pages/index.tsx` |
| `todo_created` | User created a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marked a todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | User unchecked a completed todo, marking it active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deleted a todo item (potential churn signal) | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side: new todo successfully persisted via API | `pages/api/todos/index.ts` |
| `server_todo_completed` | Server-side: todo completion status updated via API | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server-side: todo successfully deleted via API | `pages/api/todos/[id].ts` |

## Next steps

We've found an existing dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1195065) — Includes insights for:
  - [Todo Activity Overview](https://us.posthog.com/project/2/insights/X1GrGf0U) — Daily trend of todos created, completed, and deleted
  - [Todo Completion Funnel](https://us.posthog.com/project/2/insights/wQrzcm5m) — Conversion from creating to completing a todo
  - [Server-Side Events](https://us.posthog.com/project/2/insights/zM32JSUp) — Server-side todo operations trend
  - [Form Submission Rate](https://us.posthog.com/project/2/insights/xqtL1q4D) — Daily form submission trend

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
