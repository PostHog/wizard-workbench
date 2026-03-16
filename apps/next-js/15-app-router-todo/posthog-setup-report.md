<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 App Router todo application. Here's a summary of all changes made:

- **`instrumentation-client.ts`** (new): Client-side PostHog initialization using the Next.js 15.3+ `instrumentation-client` convention. Configured with a reverse proxy (`/ingest`), error exception capture, and debug mode for development.
- **`next.config.ts`** (updated): Added reverse proxy rewrites for PostHog ingestion (`/ingest/*` → `us.i.posthog.com`) and `skipTrailingSlashRedirect: true` to support PostHog API requests.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node`, configured with `flushAt: 1` and `flushInterval: 0` for immediate event flushing in serverless API routes.
- **`components/todos/todo-list.tsx`** (updated): Added client-side `posthog.capture()` calls for all key todo actions, plus `posthog.captureException()` for error tracking in catch blocks.
- **`app/api/todos/route.ts`** (updated): Added server-side event capture for `todo_created` on successful POST requests.
- **`app/api/todos/[id]/route.ts`** (updated): Added server-side event capture for `todo_updated` (PATCH) and `todo_deleted` (DELETE).
- **`.env.local`** (updated): Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: new todo created via POST API | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: todo updated via PATCH API | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side: todo deleted via DELETE API | `app/api/todos/[id]/route.ts` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with the following recommended insights:

1. **Todo creation trend** — Total count of `todo_created` events over time (line chart). Tracks usage growth.
2. **Task completion funnel** — Funnel from `todo_created` → `todo_completed`. Shows what percentage of todos get finished.
3. **Completion vs deletion rate** — Breakdown comparing `todo_completed` vs `todo_deleted` events. Reveals whether users finish or abandon tasks.
4. **Todos with descriptions** — `todo_created` filtered by `has_description = true` vs `false`. Shows how many users add context to their todos.
5. **Active users** — Unique users who captured any todo event per day/week. Core engagement metric.

Create your dashboard here: [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard)

View all events in PostHog: [https://us.posthog.com/project/2/activity/explore](https://us.posthog.com/project/2/activity/explore)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
