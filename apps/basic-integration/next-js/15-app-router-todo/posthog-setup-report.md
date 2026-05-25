<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. Here's a summary of all changes made:

- **`instrumentation-client.ts`** (new): Initializes `posthog-js` for client-side tracking using the recommended Next.js 15.3+ pattern. Configured with a reverse proxy (`/ingest`), error tracking (`capture_exceptions: true`), and debug mode in development.
- **`next.config.ts`** (updated): Added reverse proxy rewrites for `/ingest/*`, `/ingest/static/*`, and `/ingest/array/*` routes, plus `skipTrailingSlashRedirect: true` to support PostHog's trailing-slash API requests.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog Node.js client used by API routes. Configured with `flushAt: 1` and `flushInterval: 0` for immediate event flushing in short-lived server functions.
- **`components/todos/todo-list.tsx`** (updated): Four client-side events captured on successful API responses — `todo_created`, `todo_completed`, `todo_reopened`, and `todo_deleted`.
- **`app/api/todos/route.ts`** (updated): Server-side `server_todo_created` event captured in the POST handler.
- **`app/api/todos/[id]/route.ts`** (updated): Server-side `server_todo_updated` and `server_todo_deleted` events captured in the PATCH and DELETE handlers respectively.
- **`.env.local`** (updated): `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` added.

## Events

| Event name | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo item from the form | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks an active todo item as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | User unchecks a completed todo item, marking it active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side: new todo persisted via POST `/api/todos` | `app/api/todos/route.ts` |
| `server_todo_updated` | Server-side: todo updated via PATCH `/api/todos/[id]` | `app/api/todos/[id]/route.ts` |
| `server_todo_deleted` | Server-side: todo deleted via DELETE `/api/todos/[id]` | `app/api/todos/[id]/route.ts` |

## Next steps

We've instrumented the key user actions in your todo app. Create an "Analytics basics" dashboard in PostHog with these recommended insights:

- [New Insight — Todo Creations trend](/insights/new#insight=TRENDS&events=[{"id":"todo_created","type":"events"}]&date_from=-30d): Daily `todo_created` count to track user engagement over time.
- [New Insight — Todo Completions trend](/insights/new#insight=TRENDS&events=[{"id":"todo_completed","type":"events"}]&date_from=-30d): Daily `todo_completed` count to measure task completion rates.
- [New Insight — Completion funnel](/insights/new#insight=FUNNELS&events=[{"id":"todo_created","type":"events","order":0},{"id":"todo_completed","type":"events","order":1}]&date_from=-30d): Funnel from `todo_created` → `todo_completed` to see what percentage of created todos get finished.
- [New Insight — Todo Deletions trend](/insights/new#insight=TRENDS&events=[{"id":"todo_deleted","type":"events"}]&date_from=-30d): `todo_deleted` trend to monitor churn/abandonment.
- [New Insight — Reopened todos trend](/insights/new#insight=TRENDS&events=[{"id":"todo_reopened","type":"events"}]&date_from=-30d): `todo_reopened` events to understand reconsideration behavior.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
