<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 Pages Router Todo application. Here's a summary of all changes made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side with a reverse proxy, exception capture enabled, and the `2026-01-30` defaults. This is the recommended approach for Next.js 15.3+.
- **`next.config.ts`**: Added reverse proxy rewrites so PostHog events route through `/ingest`, reducing interception by ad blockers. Also added `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node` with `flushAt: 1` and `flushInterval: 0` to ensure immediate event delivery from short-lived API routes.
- **`components/todos/todo-list.tsx`**: Added client-side `posthog.capture()` calls after each user action, and `posthog.captureException()` in error handlers.
- **`pages/api/todos/index.ts`**: Added server-side capture for `todo_created` on successful POST, reading `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers for user correlation.
- **`pages/api/todos/[id].ts`**: Added server-side capture for `todo_completed`, `todo_uncompleted`, and `todo_deleted` on PATCH and DELETE routes.
- **`.env.local`**: Configured `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx`, `pages/api/todos/index.ts` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx`, `pages/api/todos/[id].ts` |
| `todo_uncompleted` | Fired when a user unchecks a completed todo | `components/todos/todo-list.tsx`, `pages/api/todos/[id].ts` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx`, `pages/api/todos/[id].ts` |

## Next steps

Visit your PostHog project to explore analytics and build dashboards based on the instrumented events:

- [PostHog Project Dashboard](https://us.posthog.com/project/238460/dashboard)
- [Explore Events](https://us.posthog.com/project/238460/events)
- [Create Insights](https://us.posthog.com/project/238460/insights/new)

Suggested insights to build:
1. **Todos Created Over Time** — Trend of `todo_created` events
2. **Completion Rate Funnel** — `todo_created` → `todo_completed` funnel
3. **Todo Deletions** — Trend of `todo_deleted` events
4. **Task Churn** — Users who create todos but never complete them (`todo_created` without `todo_completed`)
5. **Re-open Rate** — `todo_uncompleted` events over time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
