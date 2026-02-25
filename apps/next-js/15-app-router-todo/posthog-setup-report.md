<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router Todo application. Here is a summary of all changes made:

## Changes Made

### New files created
- **`instrumentation-client.ts`** — Initializes PostHog on the client side using the Next.js 15.3+ `instrumentation-client.ts` pattern. Configures the reverse proxy ingestion path (`/ingest`), enables error tracking (`capture_exceptions: true`), and sets debug mode in development.
- **`lib/posthog-server.ts`** — A singleton server-side PostHog client using `posthog-node`. Used in API routes to capture server-side events.

### Modified files
- **`next.config.ts`** — Added PostHog reverse proxy rewrites (`/ingest` → `https://us.i.posthog.com`) and `skipTrailingSlashRedirect: true` to support PostHog's trailing slash API requests.
- **`components/todos/todo-list.tsx`** — Added client-side PostHog event tracking for all todo actions. Passes the PostHog distinct ID to API requests via `x-posthog-distinct-id` header for client/server correlation.
- **`app/api/todos/route.ts`** — Added server-side `server_todo_created` event capture after successful todo creation.
- **`app/api/todos/[id]/route.ts`** — Added server-side `server_todo_updated` and `server_todo_deleted` event captures after successful updates and deletions.

### Environment variables
Added to `.env.local`:
- `NEXT_PUBLIC_POSTHOG_KEY` — PostHog project API key
- `NEXT_PUBLIC_POSTHOG_HOST` — PostHog host URL

### Packages installed
- `posthog-js` — Client-side PostHog SDK
- `posthog-node` — Server-side PostHog SDK

## Events Tracked

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User creates a new todo item with a title and optional description | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side: A new todo is successfully created via the API | `app/api/todos/route.ts` |
| `server_todo_updated` | Server-side: A todo is successfully updated via the API | `app/api/todos/[id]/route.ts` |
| `server_todo_deleted` | Server-side: A todo is successfully deleted via the API | `app/api/todos/[id]/route.ts` |

## Next steps

We've instrumented your app with 7 events covering the full todo lifecycle (create, complete, uncomplete, delete) from both client and server sides.

To set up your analytics dashboard, visit your PostHog project and create an **"Analytics basics"** dashboard with the following recommended insights:

1. **Todo Activity Over Time** — Trend chart of `todo_created`, `todo_completed`, and `todo_deleted` over time (daily)
2. **Todo Completion Funnel** — Funnel from `todo_created` → `todo_completed` to measure completion rate
3. **Todo Churn** — Count of `todo_deleted` events to track how often users abandon tasks
4. **Todo Toggle Rate** — Ratio of `todo_completed` vs `todo_uncompleted` to see re-open behavior
5. **Server vs Client Correlation** — Compare `todo_created` (client) vs `server_todo_created` (server) to ensure tracking parity

You can find your PostHog project dashboard at:
- **Project**: https://us.posthog.com/project/238460/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
