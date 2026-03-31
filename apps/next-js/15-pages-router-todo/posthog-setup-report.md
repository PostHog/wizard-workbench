<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. The integration covers client-side event tracking via `posthog-js`, server-side event tracking via `posthog-node`, a reverse proxy configuration to avoid ad-blockers, and correlation of client and server events via the `x-posthog-distinct-id` request header.

**Files created:**
- `instrumentation-client.ts` — Client-side PostHog initialization using Next.js 15.3+ instrumentation hook
- `lib/posthog-server.ts` — Singleton server-side PostHog client for API routes
- `.env.local` — Environment variables for PostHog project token and host

**Files modified:**
- `next.config.ts` — Added `/ingest` reverse proxy rewrites for PostHog ingestion
- `components/todos/todo-list.tsx` — Added client-side event capture for all todo actions
- `pages/api/todos/index.ts` — Added server-side capture for todo creation
- `pages/api/todos/[id].ts` — Added server-side capture for todo updates and deletions

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a todo as not completed | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: todo created via API (with distinct ID correlation) | `pages/api/todos/index.ts` |
| `todo_updated` | Server-side: todo updated via API (with distinct ID correlation) | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server-side: todo deleted via API (with distinct ID correlation) | `pages/api/todos/[id].ts` |

## Next steps

To monitor user behavior, create an "Analytics basics" dashboard in your PostHog project with these recommended insights:

1. **Todo creation trend** — Trends chart for `todo_created` over time (track growth in engagement)
2. **Todo completion funnel** — Funnel from `todo_created` → `todo_completed` (measure completion rate)
3. **Todo activity breakdown** — Bar chart comparing `todo_created`, `todo_completed`, and `todo_deleted` volumes
4. **Daily active users** — Unique users per day capturing `todo_created` (measure engagement breadth)
5. **Todo deletion rate** — Trends chart for `todo_deleted` vs `todo_created` (churn signal)

Visit your PostHog project to create these insights: https://us.posthog.com/project/238460

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
