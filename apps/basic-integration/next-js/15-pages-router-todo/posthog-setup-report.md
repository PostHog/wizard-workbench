<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes `posthog-js` client-side using the Next.js 15.3+ instrumentation pattern. Configures the reverse proxy (`/ingest`), error tracking (`capture_exceptions`), and session replay.
- **`lib/posthog-server.ts`** (new): Singleton `posthog-node` client for server-side event capture in API routes.
- **`next.config.ts`**: Added reverse proxy rewrites so PostHog requests route through `/ingest/*`, avoiding ad blockers and improving reliability.
- **`.env.local`**: Populated `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.
- **`components/todos/todo-list.tsx`**: Added `posthog.capture()` calls in all todo action handlers, passing `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to API routes for client–server correlation. Added `posthog.captureException()` in error handlers.
- **`pages/api/todos/index.ts`**: Added server-side `server_todo_created` event capture on successful POST, reading the distinct ID from request headers.
- **`pages/api/todos/[id].ts`**: Added server-side `server_todo_updated` and `server_todo_deleted` events on successful PATCH and DELETE respectively.

## Events

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo item as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server confirms a new todo was created via the API | `pages/api/todos/index.ts` |
| `server_todo_updated` | Server confirms a todo was updated via the API | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server confirms a todo was deleted via the API | `pages/api/todos/[id].ts` |

## Next steps

We recommend building an "Analytics basics" dashboard in PostHog with the following insights based on the events above:

1. **Todo creation trend** — Trends chart for `todo_created` over time. Tracks how many todos users are creating daily/weekly.
2. **Todo completion trend** — Trends chart for `todo_completed` over time. Measures task completion activity.
3. **Creation-to-completion funnel** — Funnel from `todo_created` → `todo_completed`. Shows what proportion of created todos get completed.
4. **Todo deletion trend** — Trends chart for `todo_deleted` over time. High deletion rates may indicate friction.
5. **Overall activity** — Trends chart combining `todo_created`, `todo_completed`, and `todo_deleted` to see overall app engagement.

You can create this dashboard manually here:

- [New dashboard](/dashboard)
- [New insight](/insights/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
