<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router Todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the Next.js 15.3+ `instrumentation-client` pattern. Configured with a reverse proxy (`/ingest`), automatic error tracking (`capture_exceptions: true`), and the `2026-01-30` defaults.
- **`lib/posthog-server.ts`** (new): Singleton PostHog Node.js client for server-side event tracking in API routes, with `flushAt: 1` and `flushInterval: 0` for immediate flushing in short-lived serverless functions.
- **`next.config.ts`** (updated): Added reverse proxy rewrites so PostHog requests are proxied through `/ingest`, reducing the chance of ad-blocker interception.
- **`.env.local`** (updated): Populated `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.
- **`components/todos/todo-list.tsx`** (updated): Added client-side `posthog.capture()` calls for `todo_created`, `todo_completed`, `todo_uncompleted`, and `todo_deleted`. Also passes `x-posthog-distinct-id` and `x-posthog-session-id` headers to API calls for client/server event correlation. Added `posthog.captureException()` in error handlers.
- **`app/api/todos/route.ts`** (updated): Added server-side `todo_created_api` event capture on successful todo creation, reading the distinct ID and session ID from request headers.
- **`app/api/todos/[id]/route.ts`** (updated): Added server-side `todo_updated_api` and `todo_deleted_api` event captures on successful update and delete operations.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created_api` | Server-side: Fired when a new todo is successfully created via the API | `app/api/todos/route.ts` |
| `todo_updated_api` | Server-side: Fired when a todo is successfully updated via the API | `app/api/todos/[id]/route.ts` |
| `todo_deleted_api` | Server-side: Fired when a todo is successfully deleted via the API | `app/api/todos/[id]/route.ts` |

## Next steps

Visit your [PostHog project](https://us.posthog.com/project/238460) to explore the events being tracked. You can build insights such as:

- **Todo creation trend** — `todo_created` over time to see daily/weekly task creation
- **Completion funnel** — `todo_created` → `todo_completed` to measure what fraction of todos get completed
- **Deletion rate** — `todo_deleted` vs `todo_created` to understand how often tasks are removed rather than completed
- **Task completion toggle** — `todo_completed` vs `todo_uncompleted` to understand how often users re-open tasks
- **API error tracking** — monitor PostHog's automatically captured exceptions from `capture_exceptions: true`

Suggested dashboard URL: [PostHog Dashboard](https://us.posthog.com/project/238460/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
