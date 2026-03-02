<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the `instrumentation-client` convention for Next.js 15.3+. Configured with a reverse proxy (`/ingest`), automatic exception capture, and debug mode in development.
- **`next.config.ts`** (updated): Added `rewrites` to proxy PostHog ingestion requests through `/ingest` so events are less likely to be blocked by tracking blockers. Also set `skipTrailingSlashRedirect: true` as required by PostHog.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node`, configured with `flushAt: 1` and `flushInterval: 0` for immediate event flushing in short-lived Next.js server functions.
- **`components/todos/todo-list.tsx`** (updated): Added client-side event captures for all four core user interactions, plus `captureException` for error tracking.
- **`app/api/todos/route.ts`** (updated): Added server-side `todo_created` event capture on successful POST.
- **`app/api/todos/[id]/route.ts`** (updated): Added server-side `todo_updated` and `todo_deleted` event captures on successful PATCH and DELETE.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: Todo successfully created via API | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: Todo successfully updated via API | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side: Todo successfully deleted via API | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1195065)
  - [Todo Activity Overview](https://us.posthog.com/project/2/insights/X1GrGf0U) — Daily trend of todos created, completed, and deleted
  - [Todo Completion Funnel](https://us.posthog.com/project/2/insights/wQrzcm5m) — Funnel from todo creation to completion (key conversion metric)
  - [Server-Side Events](https://us.posthog.com/project/2/insights/zM32JSUp) — Server-side API operation trends
  - [API Errors](https://us.posthog.com/project/2/insights/jwfkweV1) — Server-side API error tracking
  - [Form Submission Rate](https://us.posthog.com/project/2/insights/xqtL1q4D) — Daily trend of todo form submissions

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
