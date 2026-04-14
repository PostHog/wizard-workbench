<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router todo application. Here is a summary of the changes made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the `instrumentation-client.ts` pattern recommended for Next.js 15.3+. Includes `capture_exceptions: true` for automatic error tracking and routes events through a reverse proxy for better ad-blocker resilience.
- **`next.config.ts`**: Added `/ingest` reverse proxy rewrites so PostHog requests are routed through the app's own domain, plus `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new): Singleton PostHog Node.js client for server-side event capture in API routes, using `flushAt: 1` / `flushInterval: 0` for immediate delivery in serverless environments.
- **`components/todos/todo-list.tsx`**: Added `todo_created` event on successful todo creation and `todo_create_failed` with exception capture on API error.
- **`components/todos/todo-item.tsx`**: Added `todo_completed` and `todo_reopened` events when a todo's checkbox is toggled, and `todo_deleted` when a todo is removed.
- **`pages/api/todos/index.ts`**: Added server-side `todo_created_server` capture on successful POST, using the `x-posthog-distinct-id` header for user correlation.
- **`pages/api/todos/[id].ts`**: Added server-side `todo_updated_server` (PATCH) and `todo_deleted_server` (DELETE) captures.
- **`.env.local`**: Created with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` (covered by `.gitignore`).

## Events

| Event | Description | File |
|---|---|---|
| `todo_created` | User successfully created a new todo item | `components/todos/todo-list.tsx` |
| `todo_create_failed` | Creating a todo failed due to an API error | `components/todos/todo-list.tsx` |
| `todo_completed` | User marked a todo item as completed | `components/todos/todo-item.tsx` |
| `todo_reopened` | User marked a completed todo item as incomplete | `components/todos/todo-item.tsx` |
| `todo_deleted` | User deleted a todo item | `components/todos/todo-item.tsx` |
| `todo_created_server` | Server-side: a new todo was successfully created via the API | `pages/api/todos/index.ts` |
| `todo_updated_server` | Server-side: a todo was successfully updated via the API | `pages/api/todos/[id].ts` |
| `todo_deleted_server` | Server-side: a todo was successfully deleted via the API | `pages/api/todos/[id].ts` |

## Next steps

To visualise these events, create an **"Analytics basics"** dashboard in PostHog with the following suggested insights:

1. **Todo creation trend** — line chart of `todo_created` over time
2. **Todo completion rate** — funnel: `todo_created` → `todo_completed`
3. **Todo deletion rate** — bar chart comparing `todo_deleted` vs `todo_created`
4. **Error rate** — line chart of `todo_create_failed` over time
5. **Server vs client creation** — stacked bar: `todo_created` (client) vs `todo_created_server` (server)

You can create this dashboard at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
