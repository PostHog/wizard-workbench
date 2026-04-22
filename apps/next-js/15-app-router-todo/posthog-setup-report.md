<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router todo application. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured through Next.js rewrites to improve tracking reliability. Both client-side and server-side event capture are instrumented across all key todo actions.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User unchecks a completed todo | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: new todo created via POST /api/todos | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: todo updated via PATCH /api/todos/[id] | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side: todo deleted via DELETE /api/todos/[id] | `app/api/todos/[id]/route.ts` |

## Next steps

We've prepared an "Analytics basics" dashboard for you to keep an eye on user behavior, based on the events we just instrumented. Create it in PostHog with these five insights:

- [Todo creations over time — trend of `todo_created`](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=[{"id":"todo_created","type":"events"}]&date_from=-30d)
- [Todo completion funnel — `todo_created` → `todo_completed`](https://us.posthog.com/project/2/insights/new?insight=FUNNELS&events=[{"id":"todo_created","type":"events"},{"id":"todo_completed","type":"events"}]&date_from=-30d)
- [Todo deletions over time — trend of `todo_deleted`](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=[{"id":"todo_deleted","type":"events"}]&date_from=-30d)
- [Completions vs deletions — compare `todo_completed` and `todo_deleted`](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=[{"id":"todo_completed","type":"events"},{"id":"todo_deleted","type":"events"}]&date_from=-30d)
- [Uncomplete rate — trend of `todo_uncompleted`](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=[{"id":"todo_uncompleted","type":"events"}]&date_from=-30d)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
