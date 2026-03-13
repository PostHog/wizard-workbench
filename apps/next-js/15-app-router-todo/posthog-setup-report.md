<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router Todo application. Here is a summary of what was set up:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the `instrumentation-client` pattern for Next.js 15.3+. Includes session replay, exception capture, and a reverse proxy via `/ingest`.
- **`next.config.ts`** (updated): Added reverse proxy rewrites (`/ingest/*`) to route PostHog traffic through the app, reducing ad-blocker interference.
- **`lib/posthog-server.ts`** (new): Server-side PostHog client helper using `posthog-node`, configured with `flushAt: 1` and `flushInterval: 0` for reliable event delivery in short-lived serverless functions.
- **`components/todos/todo-list.tsx`** (updated): Added four client-side PostHog capture calls in event handlers, plus `captureException` for error tracking.
- **`app/api/todos/route.ts`** (updated): Added server-side capture for `todo_created` on POST success.
- **`app/api/todos/[id]/route.ts`** (updated): Added server-side captures for `todo_updated` (PATCH) and `todo_deleted` (DELETE).
- **`.env.local`** (created): Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User successfully created a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marked a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marked a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deleted a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: new todo created via API | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: todo updated via API | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side: todo deleted via API | `app/api/todos/[id]/route.ts` |

## Next steps

To visualize user behavior with these events, create an **"Analytics basics"** dashboard in PostHog (https://us.posthog.com/project/2) with the following suggested insights:

1. **Todo creation trend** — Trend of `todo_created` over time to track user engagement
2. **Task completion funnel** — Funnel from `todo_created` → `todo_completed` to measure completion rate
3. **Deletion rate** — Trend of `todo_deleted` relative to `todo_created` (churn signal)
4. **Active vs completed tasks** — Breakdown of `todo_completed` vs `todo_uncompleted` events
5. **Todo lifecycle** — Stacked area chart of all four todo events over time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
