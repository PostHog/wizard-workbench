<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the Next.js 15.3+ `instrumentation-client` pattern. Enables error tracking (`capture_exceptions: true`) and uses the reverse proxy for reliable event delivery.
- **`next.config.ts`** (updated): Added reverse proxy rewrites routing `/ingest/**` to PostHog's ingestion endpoint, preventing events from being blocked by ad blockers.
- **`lib/posthog-server.ts`** (new): Singleton PostHog Node.js client for server-side event capture in API routes. Configured with `flushAt: 1` and `flushInterval: 0` for immediate flushing.
- **`components/todos/todo-list.tsx`** (updated): Added client-side `posthog.capture()` calls for all key user actions, and `captureException()` in error handlers. Also passes `X-PostHog-Distinct-ID` and `X-PostHog-Session-ID` headers to API calls for client/server identity correlation.
- **`pages/api/todos/index.ts`** (updated): Added server-side event capture for `todo_created` on POST, correlating with the client session via request headers.
- **`pages/api/todos/[id].ts`** (updated): Added server-side event capture for `todo_updated` (PATCH) and `todo_deleted` (DELETE), correlating with the client session via request headers.
- **`.env.local`** (new): PostHog project token and host stored as environment variables.

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired when a user marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: POST /api/todos endpoint successfully creates a todo | `pages/api/todos/index.ts` |
| `todo_updated` | Server-side: PATCH /api/todos/[id] endpoint successfully updates a todo | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server-side: DELETE /api/todos/[id] endpoint successfully deletes a todo | `pages/api/todos/[id].ts` |

## Next steps

To keep an eye on user behavior, create an "Analytics basics" dashboard in PostHog with the following suggested insights:

1. **Todo Creation Trend** — [New insight →](/insights/new?insight=TRENDS) — Trend of `todo_created` events over time to track app growth.
2. **Todo Completion Trend** — [New insight →](/insights/new?insight=TRENDS) — Trend of `todo_completed` and `todo_reopened` side by side.
3. **Todo Deletion Rate** — [New insight →](/insights/new?insight=TRENDS) — Trend of `todo_deleted` events to understand churn/abandonment.
4. **Create → Complete Funnel** — [New insight →](/insights/new?insight=FUNNELS) — Conversion funnel from `todo_created` → `todo_completed` to measure completion rate.
5. **All Todo Actions** — [New insight →](/insights/new?insight=TRENDS) — All four events (`todo_created`, `todo_completed`, `todo_reopened`, `todo_deleted`) in one chart for an activity overview.

Once created, add them to a new dashboard at [/dashboard/new](/dashboard/new).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
