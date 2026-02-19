<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. Here's a summary of every change made:

- **`instrumentation-client.ts`** (new) — Initializes PostHog on the client side using the `instrumentation-client.ts` pattern (recommended for Next.js 15.3+). Configures a reverse proxy via `/ingest`, enables automatic exception capture (`capture_exceptions: true`), and turns on debug mode in development.
- **`next.config.ts`** (updated) — Added PostHog ingestion rewrites (`/ingest/static/:path*` and `/ingest/:path*`) so analytics requests are proxied through the Next.js server. Also added `skipTrailingSlashRedirect: true` as required by PostHog.
- **`lib/posthog-server.ts`** (new) — A singleton `posthog-node` client for server-side event tracking in API routes. Uses `flushAt: 1` and `flushInterval: 0` to ensure events are sent immediately in serverless environments.
- **`components/todos/todo-list.tsx`** (updated) — Added four client-side `posthog.capture()` calls in event handlers (not `useEffect`): `todo_created`, `todo_completed`, `todo_uncompleted`, and `todo_deleted`. Added `posthog.captureException()` in all three error catch blocks for error tracking.
- **`pages/api/todos/index.ts`** (updated) — Added `server_todo_created` server-side event after a todo is successfully created via POST. Reads the `X-POSTHOG-DISTINCT-ID` header to correlate client and server events.
- **`pages/api/todos/[id].ts`** (updated) — Added `server_todo_updated` server-side event after a successful PATCH, and `server_todo_deleted` after a successful DELETE.
- **`.env.local`** (created/updated) — `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables set securely.

## Events

| Event Name | Description | File |
|---|---|---|
| `todo_created` | User submitted the form to create a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marked a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marked a completed todo item as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deleted a todo item | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side: a new todo was successfully created via the API | `pages/api/todos/index.ts` |
| `server_todo_updated` | Server-side: an existing todo was updated via the API | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server-side: a todo was deleted via the API | `pages/api/todos/[id].ts` |

## Next steps

To build insights and a dashboard based on these events, visit your PostHog project and create a new **"Analytics basics"** dashboard with these suggested insights:

1. **Todo Creation Rate** — Trend of `todo_created` events over time
2. **Todo Completion Funnel** — Funnel from `todo_created` → `todo_completed`
3. **Todo Deletion Rate** — Trend of `todo_deleted` events over time
4. **Completed vs Uncompleted Toggles** — Breakdown of `todo_completed` vs `todo_uncompleted`
5. **Server-side Todo Operations** — Combined trend of `server_todo_created`, `server_todo_updated`, `server_todo_deleted`

Visit your PostHog project: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
