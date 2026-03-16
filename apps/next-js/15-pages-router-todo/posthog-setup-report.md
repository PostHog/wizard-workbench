<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the `instrumentation-client.ts` API (Next.js 15.3+). Sets up automatic session replay, error tracking (`capture_exceptions`), and routes analytics through a reverse proxy via `/ingest`.
- **`next.config.ts`**: Added PostHog reverse proxy rewrites (`/ingest/static/*` and `/ingest/*`) and `skipTrailingSlashRedirect: true` to support PostHog's trailing slash API requests.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node`, used by API routes for server-side event capture.
- **`components/todos/todo-list.tsx`**: Added client-side `posthog.capture()` calls for todo CRUD actions, plus `posthog.captureException()` in error handlers.
- **`pages/api/todos/index.ts`**: Added server-side `todo_created` event capture when a todo is successfully created via the API.
- **`pages/api/todos/[id].ts`**: Added server-side `todo_deleted` event capture when a todo is successfully deleted via the API.
- **`.env.local`**: Created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo item as not done | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: A new todo was successfully created via the API | `pages/api/todos/index.ts` |
| `todo_deleted` | Server-side: A todo was successfully deleted via the API | `pages/api/todos/[id].ts` |

## Next steps

We were unable to automatically create the dashboard due to API key scope limitations. To create the "Analytics basics" dashboard with the recommended insights, visit your PostHog project and create the following insights:

1. **Todo Created - Daily Trend** — Trends chart for `todo_created` over the last 30 days
2. **Todo Completed vs Deleted** — Trends chart comparing `todo_completed` and `todo_deleted` side by side
3. **Todo Completion Funnel** — Funnel from `todo_created` → `todo_completed`
4. **Todo Churn** — Trends chart for `todo_deleted` over the last 30 days
5. **Active Users** — Unique users per day across all todo events

Visit [PostHog Dashboards](https://us.posthog.com/project/2/dashboard) to create your "Analytics basics" dashboard and add these insights.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
