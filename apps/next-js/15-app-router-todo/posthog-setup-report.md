<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. Here's a summary of all changes made:

**New files created:**
- `instrumentation-client.ts` — Initializes PostHog on the client side using Next.js 15.3+ instrumentation API, with reverse proxy routing, exception capture, and debug mode in development.
- `lib/posthog-server.ts` — Server-side PostHog client singleton (posthog-node) with immediate flush settings (`flushAt: 1`, `flushInterval: 0`) for short-lived serverless functions.
- `.env.local` — PostHog project token and host stored as environment variables.

**Modified files:**
- `next.config.ts` — Added reverse proxy rewrites for `/ingest` → PostHog, plus `skipTrailingSlashRedirect: true` to support PostHog trailing slash API requests.
- `components/todos/todo-list.tsx` — Added client-side event tracking for all CRUD operations, error tracking in catch blocks, and PostHog identity headers on API requests for client-server correlation.
- `app/api/todos/route.ts` — Added server-side `todo_created` event on successful POST.
- `app/api/todos/[id]/route.ts` — Added server-side `todo_updated` and `todo_deleted` events on successful PATCH and DELETE.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | User marks a completed todo as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: new todo created via API (POST /api/todos) | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: todo updated via API (PATCH /api/todos/[id]) | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side: todo deleted via API (DELETE /api/todos/[id]) | `app/api/todos/[id]/route.ts` |

## Next steps

To explore your analytics, create an **"Analytics basics"** dashboard in PostHog with these suggested insights:

1. **Todo creation trend** — Trend of `todo_created` events over time (shows growth in usage)
2. **Todo completion funnel** — Funnel from `todo_created` → `todo_completed` (conversion rate)
3. **Todo deletion rate** — Trend of `todo_deleted` events (churn signal)
4. **Todo actions breakdown** — Bar chart of all todo events (`todo_created`, `todo_completed`, `todo_reopened`, `todo_deleted`) grouped by event name
5. **Todos with description** — Breakdown of `todo_created` by the `has_description` property (feature adoption)

Create a new dashboard at: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
