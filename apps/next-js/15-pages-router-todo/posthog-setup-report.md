<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. The integration includes client-side event tracking, server-side event tracking, a reverse proxy for reliable event delivery, automatic error tracking, and client-server identity correlation.

## Changes made

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the Next.js 15.3+ instrumentation API, with error tracking (`capture_exceptions: true`) and the reverse proxy host.
- **`next.config.ts`**: Added reverse proxy rewrites for PostHog ingestion (`/ingest/*`) and `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node`, configured for immediate flushing in serverless API routes.
- **`components/todos/todo-list.tsx`**: Added `posthog.capture()` calls for todo CRUD events, PostHog identity headers on API calls for client-server correlation, and `posthog.captureException()` in error handlers.
- **`pages/api/todos/index.ts`**: Added server-side `todo_created_server` event capture on POST.
- **`pages/api/todos/[id].ts`**: Added server-side `todo_updated_server` and `todo_deleted_server` event capture on PATCH and DELETE.
- **`.env.local`**: Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

## Instrumented events

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created_server` | Server-side event fired when a todo is created via the API | `pages/api/todos/index.ts` |
| `todo_updated_server` | Server-side event fired when a todo is updated via the API | `pages/api/todos/[id].ts` |
| `todo_deleted_server` | Server-side event fired when a todo is deleted via the API | `pages/api/todos/[id].ts` |

## Next steps

To explore your analytics data, visit your PostHog project and create an "Analytics basics" dashboard with these recommended insights:

- **Todo Creation Trend** — Trends: `todo_created` over time
- **Todo Completion Funnel** — Funnel: `todo_created` → `todo_completed`
- **Todo Actions Overview** — Trends: `todo_created`, `todo_completed`, `todo_deleted` compared
- **Completion Rate** — Formula: `todo_completed / todo_created`
- **Todo Deletions** — Trends: `todo_deleted` over time

Visit your project at: https://us.posthog.com/project/2

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
