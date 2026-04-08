<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes the PostHog client-side SDK using the Next.js 15.3+ instrumentation pattern. Enables automatic pageview tracking, session replay, and exception capture via `capture_exceptions: true`. Uses a reverse proxy at `/ingest` to avoid ad-blockers.
- **`lib/posthog-server.ts`** (new): Singleton PostHog Node.js client for server-side event capture in API routes. Uses `flushAt: 1` / `flushInterval: 0` to ensure events are sent synchronously during request handling.
- **`next.config.ts`** (updated): Added `/ingest` reverse proxy rewrites so PostHog requests are routed through the Next.js server, improving reliability and bypassing browser blockers.
- **`components/todos/todo-list.tsx`** (updated): Added client-side event capture for all core todo actions (`todo_created`, `todo_completed`, `todo_reopened`, `todo_deleted`). Also passes `x-posthog-distinct-id` header to API calls for client/server correlation. Exception capture added to all catch blocks.
- **`app/api/todos/route.ts`** (updated): Added server-side `todo_created` event capture on successful POST, using the client's distinct ID from the `x-posthog-distinct-id` request header.
- **`app/api/todos/[id]/route.ts`** (updated): Added server-side `todo_deleted` event capture on DELETE and `todo_status_updated` event capture on PATCH (only when `completed` status changes).

| Event | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | User marks a completed todo as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side capture on POST /api/todos | `app/api/todos/route.ts` |
| `todo_deleted` | Server-side capture on DELETE /api/todos/[id] | `app/api/todos/[id]/route.ts` |
| `todo_status_updated` | Server-side capture when completion status changes | `app/api/todos/[id]/route.ts` |

## Next steps

Visit your PostHog project to explore the data as events start flowing in. Suggested insights to build on your "Analytics basics" dashboard:

- **Todo creation trend** — Trends chart for `todo_created` over time to track engagement
- **Completion funnel** — Funnel from `todo_created` → `todo_completed` to measure task completion rate
- **Deletion rate** — Trends chart for `todo_deleted` to monitor churn/disengagement signals
- **Completion vs reopened ratio** — Stacked trends of `todo_completed` vs `todo_reopened` to understand workflow patterns
- **Active users** — Unique users performing any todo action per day/week

Dashboard: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
