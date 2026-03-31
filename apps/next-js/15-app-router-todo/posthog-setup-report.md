<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router Todo application. The integration covers client-side event tracking, server-side event tracking, error capture, and a reverse proxy for reliable event delivery.

**Files created or modified:**

- `instrumentation-client.ts` — Client-side PostHog initialization using Next.js 15.3+ instrumentation hook. Enables session replay, autocapture, and exception tracking.
- `lib/posthog-server.ts` — Singleton PostHog Node.js client for server-side event capture in API routes.
- `next.config.ts` — Added reverse proxy rewrites so PostHog events route through `/ingest/*`, improving ad-blocker resilience.
- `components/todos/todo-list.tsx` — Added client-side capture for `todo_created`, `todo_completed`, `todo_uncompleted`, and `todo_deleted` events, plus `captureException` in all error handlers.
- `app/api/todos/route.ts` — Added server-side capture for `todo_created` on successful POST.
- `app/api/todos/[id]/route.ts` — Added server-side capture for `todo_updated` on PATCH and `todo_deleted` on DELETE.
- `.env.local` — Created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | Fired when a user successfully creates a new todo | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user marks a completed todo as not completed | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: todo created via POST /api/todos | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: todo updated via PATCH /api/todos/[id] | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side: todo deleted via DELETE /api/todos/[id] | `app/api/todos/[id]/route.ts` |

## Next steps

To visualize these events, visit your PostHog project and create an "Analytics basics" dashboard with the following suggested insights:

- **Todos created over time** — Trend of `todo_created` events
- **Task completion rate** — Funnel from `todo_created` → `todo_completed`
- **Completion vs deletion** — Breakdown comparing `todo_completed` vs `todo_deleted`
- **Uncomplete rate** — Trend of `todo_uncompleted` events (tasks marked back as incomplete)
- **Error rate** — Trend of `$exception` events to monitor client-side errors

Visit your PostHog dashboard: https://us.posthog.com/project/238460/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
