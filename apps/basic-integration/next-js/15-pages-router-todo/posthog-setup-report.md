<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 15 Pages Router todo application. PostHog is now fully instrumented with client-side event tracking, server-side event tracking, a reverse proxy for reliable event delivery, and automatic error/exception capture.

**Files created:**
- `instrumentation-client.ts` — initializes PostHog on the client via Next.js 15.3+ instrumentation, enabling session replay, error tracking, and analytics
- `lib/posthog-server.ts` — server-side PostHog singleton using `posthog-node`
- `.env.local` — environment variables for PostHog project token and host

**Files modified:**
- `next.config.ts` — added reverse proxy rewrites (`/ingest/*`) so analytics requests route through your own domain, avoiding ad-blockers
- `components/todos/todo-list.tsx` — added client-side `posthog.capture()` calls and PostHog distinct ID/session ID headers on all API requests
- `pages/api/todos/index.ts` — server-side `todo_created` capture on POST
- `pages/api/todos/[id].ts` — server-side `todo_updated` and `todo_deleted` captures on PATCH/DELETE

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | Fired when a user successfully creates a new todo | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired when a user unchecks a completed todo | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: POST /api/todos successfully creates a todo | `pages/api/todos/index.ts` |
| `todo_updated` | Server-side: PATCH /api/todos/[id] updates a todo | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server-side: DELETE /api/todos/[id] deletes a todo | `pages/api/todos/[id].ts` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with these suggested insights:

1. **Todo creation trend** — Trends chart for `todo_created` over time (daily)
2. **Todo completion rate** — Trends formula: `todo_completed / todo_created * 100` to track what % of created todos get completed
3. **Todo deletion rate** — Trends chart for `todo_deleted` over time
4. **Todo lifecycle funnel** — Funnel insight: `todo_created` → `todo_completed` to measure conversion
5. **Active users** — Trends chart for `todo_created` with unique users aggregation

Visit [PostHog Dashboards](/dashboard) to create your dashboard and add these insights.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
