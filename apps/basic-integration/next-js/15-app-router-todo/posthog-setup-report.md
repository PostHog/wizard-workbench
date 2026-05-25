<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes the PostHog client-side SDK using `posthog-js` via the `instrumentation-client` pattern recommended for Next.js 15.3+. Events flow through a reverse proxy to avoid tracking blockers. Exception capture is enabled for automatic error tracking.
- **`next.config.ts`** (edited): Added reverse proxy rewrites so PostHog traffic routes through `/ingest/*` instead of directly to PostHog servers.
- **`lib/posthog-server.ts`** (new): A singleton server-side PostHog client using `posthog-node` with `flushAt: 1` and `flushInterval: 0` to ensure events are sent immediately from API routes.
- **`components/todos/todo-list.tsx`** (edited): Added `posthog.capture()` calls in the four todo action handlers, and `posthog.captureException()` in each catch block for error tracking.
- **`app/api/todos/route.ts`** (edited): Added server-side `todo_created_server` event capture after successful todo creation.
- **`app/api/todos/[id]/route.ts`** (edited): Added server-side `todo_updated_server` and `todo_deleted_server` event captures after successful updates and deletes.
- **`.env.local`** (created): PostHog project token and host set as environment variables.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User unchecks a completed todo, marking it active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created_server` | Server-side: todo successfully created via POST /api/todos | `app/api/todos/route.ts` |
| `todo_updated_server` | Server-side: todo successfully updated via PATCH /api/todos/[id] | `app/api/todos/[id]/route.ts` |
| `todo_deleted_server` | Server-side: todo successfully deleted via DELETE /api/todos/[id] | `app/api/todos/[id]/route.ts` |

## Next steps

We've instrumented your app with client-side and server-side event tracking. Head to your PostHog dashboards to build insights on these events:

- [Dashboards](/dashboards)
- [Events explorer — todo events](/events?filters={"filter_test_accounts":false})
- [Create a trends insight for todo creation over time](/insights/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
