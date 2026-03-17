<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog analytics has been added to this Next.js 15 Pages Router todo application with both client-side and server-side event tracking.

**Changes made:**

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using `posthog-js` via the Next.js instrumentation hook. Configured with a reverse proxy (`/ingest`), error tracking (`capture_exceptions: true`), and debug mode for development.
- **`next.config.ts`**: Added rewrites for the PostHog reverse proxy (`/ingest/static/:path*` and `/ingest/:path*`) and `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node`, with `flushAt: 1` and `flushInterval: 0` for immediate event flushing in API routes.
- **`components/todos/todo-list.tsx`**: Added client-side `posthog.capture()` calls for todo lifecycle events and `posthog.captureException()` for error tracking.
- **`pages/api/todos/index.ts`**: Added server-side `server_todo_created` event on successful POST.
- **`pages/api/todos/[id].ts`**: Added server-side `server_todo_deleted` event on successful DELETE.
- **`.env.local`**: Created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user marks a completed todo item as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event fired when a todo is successfully created via the API | `pages/api/todos/index.ts` |
| `server_todo_deleted` | Server-side event fired when a todo is successfully deleted via the API | `pages/api/todos/[id].ts` |

## Next steps

Visit your [PostHog project](https://us.posthog.com/project/2) to explore incoming events and build insights around:

- **Todo creation funnel**: Track `todo_created` to understand how often users add tasks.
- **Completion rate**: Compare `todo_completed` vs `todo_created` to measure task completion.
- **Churn signal**: Monitor `todo_deleted` events — high deletion rates may indicate user frustration.
- **Server vs client correlation**: Compare `server_todo_created` and `server_todo_deleted` against their client-side counterparts to detect any API/UI discrepancies.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
