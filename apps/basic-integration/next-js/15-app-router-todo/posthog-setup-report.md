<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new): Client-side PostHog initialization using the Next.js 15.3+ `instrumentation-client.ts` pattern. Enables autocapture, session replay, and exception capture (`capture_exceptions: true`). Routes traffic through a reverse proxy (`/ingest`) for improved reliability.
- **`lib/posthog-server.ts`** (new): A singleton server-side PostHog client using `posthog-node`. Used by API routes to capture server-side events with `flushAt: 1` and `flushInterval: 0` so events flush immediately on each request.
- **`next.config.ts`** (edited): Added PostHog reverse proxy rewrites (`/ingest/static/*`, `/ingest/array/*`, `/ingest/*`) and `skipTrailingSlashRedirect: true`.
- **`components/todos/todo-list.tsx`** (edited): Added client-side `posthog.capture()` calls for `todo_created`, `todo_completed`, `todo_uncompleted`, and `todo_deleted` events, along with `posthog.captureException()` in all error handlers.
- **`app/api/todos/route.ts`** (edited): Added server-side `todo_created` capture via `posthog-node` after successful todo creation.
- **`app/api/todos/[id]/route.ts`** (edited): Added server-side `todo_updated` and `todo_deleted` captures via `posthog-node` after successful update/delete operations.
- **`.env.local`** (created): Contains `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user marks a completed todo item as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: Fired when a new todo is created via the API | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: Fired when a todo is updated via the API | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side: Fired when a todo is deleted via the API | `app/api/todos/[id]/route.ts` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Todo Creation Trend** — Trends chart for `todo_created` over time, to track growth in usage
2. **Todo Completion Funnel** — Funnel from `todo_created` → `todo_completed`, to measure task follow-through
3. **Todo Actions Over Time** — Stacked trends chart for `todo_created`, `todo_completed`, and `todo_deleted`, to see overall activity patterns
4. **Completion vs Deletion Rate** — Trends comparing `todo_completed` and `todo_deleted`, to understand whether users complete or abandon tasks
5. **Active vs Completed Task Ratio** — Trends for `todo_completed` vs `todo_uncompleted`, to measure re-opening behavior

Navigate to your PostHog project to set these up:

- [PostHog Dashboards — create "Analytics basics"](https://us.posthog.com/project/2/dashboard)
- [Trends insight builder](https://us.posthog.com/project/2/insights/new)
- [Funnel insight builder](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
