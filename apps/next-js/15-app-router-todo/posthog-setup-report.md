<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. The integration covers client-side event tracking, server-side event tracking via API routes, a reverse proxy for PostHog ingestion, client-side PostHog initialization using the Next.js 15.3+ `instrumentation-client.ts` pattern, and exception capture for error tracking.

**Files created or modified:**

| File | Change |
|------|--------|
| `instrumentation-client.ts` | Created — initializes PostHog client-side with reverse proxy, exception capture, and debug mode |
| `lib/posthog-server.ts` | Created — singleton PostHog Node.js client for server-side event tracking |
| `next.config.ts` | Modified — added `/ingest/*` reverse proxy rewrites and `skipTrailingSlashRedirect: true` |
| `components/todos/todo-list.tsx` | Modified — added client-side event tracking and exception capture |
| `app/api/todos/route.ts` | Modified — added server-side `server_todo_created` event on POST |
| `app/api/todos/[id]/route.ts` | Modified — added server-side `server_todo_completed` and `server_todo_deleted` events |

**Events instrumented:**

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | User successfully created a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marked a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marked a completed todo item as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deleted a todo item | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side: A new todo was successfully created via the API | `app/api/todos/route.ts` |
| `server_todo_completed` | Server-side: A todo completion status was updated via the API | `app/api/todos/[id]/route.ts` |
| `server_todo_deleted` | Server-side: A todo was successfully deleted via the API | `app/api/todos/[id]/route.ts` |

## Next steps

To monitor user behavior, build the following insights in your PostHog project dashboard:

- **Todo creation trend** — Trends chart for `todo_created` to track daily/weekly task creation volume
- **Task completion funnel** — Funnel from `todo_created` → `todo_completed` to measure completion rate
- **Deletion rate** — Trends chart for `todo_deleted` compared to `todo_created` to see churn of tasks
- **Server vs client event correlation** — Compare `todo_created` with `server_todo_created` to validate tracking consistency
- **Error tracking** — Error tracking dashboard to monitor exceptions captured via `posthog.captureException()`

Visit your PostHog project at https://us.posthog.com/project/2 to create these insights and dashboards.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
