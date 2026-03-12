<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router todo application. Client-side analytics are initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route PostHog requests through `/ingest`. A server-side PostHog client in `lib/posthog-server.ts` powers event tracking from API route handlers. All four core user actions — creating, completing, uncompleting, and deleting todos — are tracked both client-side (in `components/todos/todo-list.tsx`) and server-side (in the API routes), with exception capture added to error paths.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | User successfully created a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marked a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marked a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deleted a todo item | `components/todos/todo-list.tsx` |
| `todo_created_api` | Server successfully created a new todo via POST /api/todos | `app/api/todos/route.ts` |
| `todo_updated_api` | Server successfully updated a todo via PATCH /api/todos/[id] | `app/api/todos/[id]/route.ts` |
| `todo_deleted_api` | Server successfully deleted a todo via DELETE /api/todos/[id] | `app/api/todos/[id]/route.ts` |

## Next steps

To visualize user behavior, create an **"Analytics basics"** dashboard in PostHog with these suggested insights:

- **Todo creation funnel** — Funnel from `todo_created` → `todo_completed`: tracks how many created todos eventually get completed
- **Todo creation trend** — Trend of `todo_created` over time: measures app engagement and growth
- **Todo completion rate** — `todo_completed` vs `todo_uncompleted` breakdown: shows task management patterns
- **Todo deletion trend** — Trend of `todo_deleted` over time: monitors churn/abandonment behavior
- **Active users** — Unique users performing any todo action: overall engagement metric

Visit your PostHog project to create this dashboard: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
