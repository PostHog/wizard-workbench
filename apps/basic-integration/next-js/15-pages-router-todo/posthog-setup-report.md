<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route all analytics traffic through `/ingest` to reduce ad-blocker interference. A server-side PostHog client (`lib/posthog-server.ts`) powers API-route tracking. Client-side events fire on successful mutations in `todo-list.tsx`, and the client passes its distinct ID and session ID as request headers so server-side API routes can emit correlated events using the same identity.

| Event | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | User marks a completed todo item as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side: new todo created via the API | `pages/api/todos/index.ts` |
| `server_todo_updated` | Server-side: todo updated via the API | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server-side: todo deleted via the API | `pages/api/todos/[id].ts` |

## Next steps

Dashboard creation was not completed automatically because the MCP API key is missing `dashboard:write` and `insight:write` scopes. You can create an "Analytics basics (wizard)" dashboard manually in your PostHog project with insights like:

- **Todo creation trend** — Trends chart of `todo_created` over time to track user engagement
- **Task completion funnel** — Funnel from `todo_created` → `todo_completed` to measure completion rate
- **Deletion rate** — Trends chart of `todo_deleted` to spot churn signals
- **Todo reopened rate** — Trends chart of `todo_reopened` to understand rework patterns
- **Server vs client event correlation** — Compare `todo_created` and `server_todo_created` volume to verify end-to-end tracking

Visit your PostHog project to create these insights: [PostHog Project Dashboard](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
