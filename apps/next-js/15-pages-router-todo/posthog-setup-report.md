<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router Todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the recommended `instrumentation-client.ts` approach for Next.js 15.3+. Includes `capture_exceptions: true` for automatic error tracking and a reverse proxy `api_host` configuration.
- **`next.config.ts`**: Added reverse proxy rewrites for PostHog ingestion (`/ingest/*` → PostHog US cloud) and set `skipTrailingSlashRedirect: true` for API compatibility.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog Node client used by API routes. Uses `flushAt: 1` / `flushInterval: 0` to ensure events are sent immediately in serverless-style request handlers.
- **`components/todos/todo-list.tsx`**: Added client-side PostHog event captures for todo lifecycle actions. Passes `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to the `POST /api/todos` and `DELETE /api/todos/:id` requests so server-side events are correlated with the same user. Added `posthog.captureException()` in all catch blocks.
- **`pages/api/todos/index.ts`**: Added server-side `server_todo_created` event on successful POST, reading distinct ID and session ID from request headers.
- **`pages/api/todos/[id].ts`**: Added server-side `server_todo_deleted` event on successful DELETE, reading distinct ID and session ID from request headers.
- **`.env.local`**: Created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

## Events

| Event | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired when a user marks a completed todo item as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event fired when a todo is created via the API | `pages/api/todos/index.ts` |
| `server_todo_deleted` | Server-side event fired when a todo is deleted via the API | `pages/api/todos/[id].ts` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with these suggested insights:

1. **Todo creation trend** — Trend of `todo_created` over time. Shows how actively users are creating tasks.
2. **Todo completion funnel** — Funnel: `todo_created` → `todo_completed`. Measures the conversion from creating to completing tasks (a key churn signal).
3. **Todo deletion rate** — Trend of `todo_deleted` over time. High deletion could indicate users are abandoning tasks.
4. **Task completion vs. reopening** — Compare trends of `todo_completed` and `todo_reopened`. A high `todo_reopened` count suggests users reconsider completed work.
5. **Client vs. server event correlation** — Stacked bar of `todo_created` and `server_todo_created` to verify client-server event parity and detect any dropped server-side events.

You can build this dashboard at: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
