<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router Todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using Next.js 15.3+ instrumentation. Configures a reverse proxy, exception capture, and debug mode in development.
- **`next.config.ts`** (updated): Added reverse proxy rewrites for `/ingest/*` to route PostHog traffic through the app server (improves ad-blocker resistance and performance). Also added `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client (`posthog-node`) used in API routes to capture server-side events.
- **`components/todos/todo-list.tsx`** (updated): Added `posthog.capture()` calls for all four core todo lifecycle events, plus `posthog.captureException()` in error handlers.
- **`pages/api/todos/index.ts`** (updated): Server-side `todo_created` event captured on successful POST.
- **`pages/api/todos/[id].ts`** (updated): Server-side `todo_updated` and `todo_deleted` events captured on successful PATCH and DELETE. Reads the `X-POSTHOG-DISTINCT-ID` request header to correlate server events with the client-side user.
- **`.env.local`** (created): `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` set.

| Event | Description | File |
|---|---|---|
| `todo_created` | User successfully adds a new todo via the form | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks an active todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | User marks a completed todo as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo (includes `was_completed` property) | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side: todo created via POST /api/todos | `pages/api/todos/index.ts` |
| `server_todo_updated` | Server-side: todo updated via PATCH /api/todos/[id] | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server-side: todo deleted via DELETE /api/todos/[id] | `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1630907)

Suggested insights to add to your "Analytics basics" dashboard in PostHog:

1. **Todo Creation Rate** — Trends chart of `todo_created` over time (daily) to track engagement.
2. **Todo Completion Funnel** — Funnel from `todo_created` → `todo_completed` to measure task completion rate.
3. **Todo Deletion Rate** — Trends chart of `todo_deleted` broken down by `was_completed` to see if users delete finished or unfinished tasks.
4. **Todo Lifecycle Overview** — Multi-series trends of `todo_created`, `todo_completed`, and `todo_deleted` side-by-side.
5. **Server vs Client Event Correlation** — Trends of `server_todo_created` alongside `todo_created` to verify client/server event parity.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
