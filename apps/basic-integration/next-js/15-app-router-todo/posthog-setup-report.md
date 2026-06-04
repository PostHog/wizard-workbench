<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog analytics has been added to this Next.js 15 App Router todo application with client-side initialization via `instrumentation-client.ts`, a reverse proxy configured in `next.config.ts`, a server-side PostHog client in `lib/posthog-server.ts`, and event capture across the core todo CRUD actions. Error tracking via `captureException` is also in place for all async operations.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | User unchecks a completed todo, marking it as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: new todo successfully created via POST /api/todos | `app/api/todos/route.ts` |

## Next steps

To create a dashboard in PostHog, visit [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards) and create a new dashboard named **"Analytics basics (wizard)"** with these suggested insights:

1. **Todo creation trend** — Trends chart for `todo_created` over time (tracks growth in task creation)
2. **Todo completion rate** — Formula insight: `todo_completed / todo_created * 100` (core engagement metric)
3. **Todo deletion rate** — Trends chart for `todo_deleted` over time (churn signal)
4. **Complete vs. reopen breakdown** — `todo_completed` vs `todo_reopened` side-by-side trend (task management behavior)
5. **Todo lifecycle funnel** — Funnel: `todo_created` → `todo_completed` (conversion from creation to done)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
