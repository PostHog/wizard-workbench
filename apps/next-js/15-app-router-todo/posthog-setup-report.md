<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. Here's a summary of what was done:

**Client-side initialization** (`instrumentation-client.ts`): PostHog is initialized using the `instrumentation-client.ts` approach — the correct method for Next.js 15.3+. It uses a reverse proxy (`/ingest`) to avoid ad blockers, enables automatic exception capture, and turns on debug mode in development.

**Reverse proxy** (`next.config.ts`): Added `/ingest` rewrites so analytics requests pass through the Next.js server, improving data reliability. Also enabled `skipTrailingSlashRedirect` as required by PostHog.

**Server-side client** (`lib/posthog-server.ts`): A singleton `posthog-node` client is available for server-side event capture from API routes.

**Client-side event tracking** (`components/todos/todo-list.tsx`): Four user-action events are captured after successful API responses. Errors in all async handlers are forwarded to PostHog exception tracking.

**Server-side event tracking** (`app/api/todos/route.ts`, `app/api/todos/[id]/route.ts`): Three server-side events are captured from the API routes. They read `X-PostHog-Distinct-ID` and `X-PostHog-Session-ID` headers to correlate server events with the client-side user session.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `todo_added` | Fired client-side when a user successfully creates a new todo | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired client-side when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired client-side when a user marks a completed todo as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired client-side when a user successfully deletes a todo | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: fired when a new todo is persisted via POST /api/todos | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: fired when a todo is updated via PATCH /api/todos/[id] | `app/api/todos/[id]/route.ts` |
| `todo_deleted_server` | Server-side: fired when a todo is deleted via DELETE /api/todos/[id] | `app/api/todos/[id]/route.ts` |

## Next steps

To explore your analytics in PostHog, create an **"Analytics basics"** dashboard with these recommended insights:

1. **Todo creation trend** — Trends chart for `todo_added` over time. Shows daily/weekly growth in user engagement.
2. **Todo completion funnel** — Funnel from `todo_added` → `todo_completed`. Measures what fraction of created todos get completed.
3. **Task lifecycle breakdown** — Trends comparing `todo_added`, `todo_completed`, `todo_reopened`, and `todo_deleted` side by side.
4. **Deletion rate** — Trends chart for `todo_deleted` as a share of `todo_added`. Highlights churn (tasks abandoned rather than completed).
5. **Server-side creation confirmation** — Trends chart for `todo_created` (server) alongside `todo_added` (client) to verify parity between client and server tracking.

Visit your PostHog project to build these: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
