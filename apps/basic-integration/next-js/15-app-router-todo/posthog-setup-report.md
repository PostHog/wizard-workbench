# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router todo application. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new) — Initializes posthog-js on the client side using the `instrumentation-client` pattern for Next.js 15.3+. Includes reverse proxy routing, error tracking (`capture_exceptions`), and debug mode in development.
- **`next.config.ts`** — Added reverse proxy rewrites to route PostHog requests through `/ingest/*` to avoid ad blockers, including routes for both the ingestion endpoint and static assets.
- **`lib/posthog-server.ts`** (new) — Server-side PostHog client singleton using `posthog-node` with `flushAt: 1` and `flushInterval: 0` for reliable event delivery in short-lived serverless functions.
- **`components/todos/todo-list.tsx`** — Added four client-side `posthog.capture()` calls in the todo action handlers (add, toggle complete, toggle incomplete, delete). The PostHog distinct ID is passed to the API via an `X-POSTHOG-DISTINCT-ID` header to correlate client and server events. Exception tracking added to all catch blocks.
- **`app/api/todos/route.ts`** — Added a server-side `server_todo_created` event on successful POST, using the distinct ID from the request header.
- **`app/api/todos/[id]/route.ts`** — Added `server_todo_updated` and `server_todo_deleted` server-side events on successful PATCH and DELETE respectively.
- **`.env.local`** — Created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

## Events

| Event | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event fired when a new todo is successfully created via the API | `app/api/todos/route.ts` |
| `server_todo_updated` | Server-side event fired when a todo is updated via the API | `app/api/todos/[id]/route.ts` |
| `server_todo_deleted` | Server-side event fired when a todo is deleted via the API | `app/api/todos/[id]/route.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Todo creation trend** — Trends chart for `todo_created` over time to track user engagement growth
2. **Todo completion funnel** — Funnel from `todo_created` → `todo_completed` to measure task completion rate
3. **Todo deletion rate** — Trends chart for `todo_deleted` to monitor churn/abandonment
4. **Active vs completed todos** — Breakdown comparing `todo_completed` vs `todo_uncompleted` events
5. **Server vs client event correlation** — Trends chart comparing `todo_created` and `server_todo_created` to validate the client/server pipeline

Set up your dashboard here: [PostHog Dashboards](/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
