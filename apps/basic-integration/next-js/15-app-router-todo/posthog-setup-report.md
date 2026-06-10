<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of the Next.js 15 App Router todo application with PostHog. The integration adds client-side analytics via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), a reverse proxy through Next.js rewrites in `next.config.ts`, a reusable server-side PostHog client in `lib/posthog-server.ts`, client-side event tracking in the main todo list component, and server-side event tracking in both API route files.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User successfully creates a new todo item from the form | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks an active todo as completed by checking its checkbox | `components/todos/todo-list.tsx` |
| `todo_reopened` | User unchecks a completed todo to mark it as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: new todo successfully persisted via POST /api/todos | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: todo successfully updated via PATCH /api/todos/[id] | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side: todo successfully deleted via DELETE /api/todos/[id] | `app/api/todos/[id]/route.ts` |

## Next steps

A PostHog dashboard named **"Analytics basics (wizard)"** could not be created automatically because the current API key is missing the `dashboard:write` and `query:read` scopes. To create it manually, visit your PostHog project and add these insights:

1. **Todo creation trend** — Trends insight for `todo_created` over time
2. **Todo completion rate** — Formula insight: `todo_completed / todo_created * 100` to track how many created todos get completed
3. **Todo deletion trend** — Trends insight for `todo_deleted` over time
4. **Active vs completed breakdown** — Trends showing `todo_completed` vs `todo_reopened` side by side
5. **Create → Complete funnel** — Funnel from `todo_created` → `todo_completed`

Visit [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards) to create the dashboard.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
