<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router Todo application. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (created): Initializes PostHog client-side using the `instrumentation-client` approach recommended for Next.js 15.3+. Configured with a reverse proxy (`/ingest`), error tracking (`capture_exceptions: true`), and debug mode in development.
- **`next.config.ts`** (updated): Added reverse proxy rewrites to route PostHog requests through `/ingest`, reducing ad-blocker interference. Also set `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (created): Singleton server-side PostHog client using `posthog-node`. Configured with `flushAt: 1` and `flushInterval: 0` to ensure events are sent immediately in short-lived server functions.
- **`components/todos/todo-list.tsx`** (updated): Added client-side event captures for all todo CRUD actions, plus `captureException` in error handlers.
- **`app/api/todos/route.ts`** (updated): Added server-side `todo_created` event capture when a new todo is successfully created via the API.
- **`app/api/todos/[id]/route.ts`** (updated): Added server-side `todo_updated` event on PATCH and `todo_deleted` event on DELETE.
- **`.env.local`** (created): Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user marks a completed todo as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: fired when a todo is successfully created via API | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: fired when a todo is updated via API | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side: fired when a todo is deleted via API | `app/api/todos/[id]/route.ts` |

## Next steps

We've prepared an "Analytics basics" dashboard for you. Visit your PostHog project to create it with these recommended insights based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard)
- [Insight 1 — Todo Creation Trend: Daily count of `todo_created` events over time](https://us.posthog.com/project/2/insights/new)
- [Insight 2 — Todo Completion Funnel: Conversion from `todo_created` → `todo_completed`](https://us.posthog.com/project/2/insights/new)
- [Insight 3 — Todos Deleted Over Time: Daily count of `todo_deleted` events](https://us.posthog.com/project/2/insights/new)
- [Insight 4 — Completion vs Uncomplete Rate: `todo_completed` vs `todo_uncompleted` side by side](https://us.posthog.com/project/2/insights/new)
- [Insight 5 — Todo Activity Overview: All todo events (`todo_created`, `todo_completed`, `todo_deleted`) compared](https://us.posthog.com/project/2/insights/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
