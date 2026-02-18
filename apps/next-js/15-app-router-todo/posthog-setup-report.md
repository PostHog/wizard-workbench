<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. The integration covers both client-side and server-side event tracking, a reverse proxy setup to improve ad-blocker resistance, and exception capture for error tracking.

**Files created:**
- `instrumentation-client.ts` — Initializes PostHog client-side using the Next.js 15.3+ recommended approach (`instrumentation-client.ts`). Enables exception capture for automatic error tracking and debug mode in development.
- `lib/posthog-server.ts` — Singleton PostHog Node.js client for server-side event tracking in API routes.

**Files modified:**
- `next.config.ts` — Added PostHog reverse proxy rewrites (`/ingest/*` → `us.i.posthog.com`) and `skipTrailingSlashRedirect: true`.
- `components/todos/todo-list.tsx` — Added client-side event capture for all four user actions, plus `x-posthog-distinct-id` headers on API calls for client–server correlation, and `captureException` in error handlers.
- `app/api/todos/route.ts` — Added server-side `todo_created_server` event on POST, reading the distinct ID from the `x-posthog-distinct-id` request header.
- `app/api/todos/[id]/route.ts` — Added server-side `todo_updated_server` (PATCH) and `todo_deleted_server` (DELETE) events.

**Environment variables set in `.env.local`:**
- `NEXT_PUBLIC_POSTHOG_KEY` — PostHog project API key
- `NEXT_PUBLIC_POSTHOG_HOST` — PostHog host URL

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | Fired client-side when user successfully creates a new todo item. Includes `todo_id` and `has_description`. | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired client-side when user marks a todo as completed. Includes `todo_id`. | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired client-side when user un-marks a completed todo. Includes `todo_id`. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired client-side when user deletes a todo item. Includes `todo_id`. | `components/todos/todo-list.tsx` |
| `todo_created_server` | Server-side mirror of todo creation event. Fired in the POST API route. Includes `todo_id` and `has_description`. | `app/api/todos/route.ts` |
| `todo_updated_server` | Server-side event fired when a todo is updated (e.g. completion toggled) via the PATCH API route. Includes `todo_id` and `completed`. | `app/api/todos/[id]/route.ts` |
| `todo_deleted_server` | Server-side event fired when a todo is deleted via the DELETE API route. Includes `todo_id`. | `app/api/todos/[id]/route.ts` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Todos Created Over Time** — Trend chart on `todo_created`, daily, last 30 days
2. **Todos Completed Over Time** — Trend chart on `todo_completed`, daily, last 30 days
3. **Todo Completion Funnel** — Funnel from `todo_created` → `todo_completed`, last 30 days
4. **Todos Deleted Over Time** — Trend chart on `todo_deleted` (churn signal), daily, last 30 days
5. **Creation vs Completion Trend** — Multi-series trend of `todo_created` and `todo_completed` together, last 30 days

Navigate to [https://us.posthog.com/project/238460/dashboards](https://us.posthog.com/project/238460/dashboards) to create the dashboard.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
