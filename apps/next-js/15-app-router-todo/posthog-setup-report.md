<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router todo application. The integration covers client-side analytics via `posthog-js`, server-side analytics via `posthog-node`, a reverse proxy to reduce tracking-blocker interference, and exception capture for error tracking.

**Files created:**
- `instrumentation-client.ts` — Initializes PostHog client-side using the Next.js 15.3+ instrumentation hook, with reverse proxy, error tracking, and debug mode in development.
- `lib/posthog-server.ts` — Singleton server-side PostHog client used in API routes.

**Files modified:**
- `next.config.ts` — Added reverse proxy rewrites (`/ingest/*` → PostHog US) and `skipTrailingSlashRedirect: true`.
- `components/todos/todo-list.tsx` — Added `todo_created`, `todo_completed`, `todo_reopened`, and `todo_deleted` events, plus `captureException` in error handlers.
- `app/api/todos/route.ts` — Added server-side `todo_created` event on POST with `x-posthog-distinct-id` header support.
- `app/api/todos/[id]/route.ts` — Added server-side `todo_updated` event on PATCH and `todo_deleted` on DELETE.

**Environment:**
- `.env.local` — `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` set.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | Fired when a user creates a new todo item via the form | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired when a user marks a completed todo as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: Fired when the API creates a new todo | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: Fired when the API updates a todo | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side: Fired when the API deletes a todo | `app/api/todos/[id]/route.ts` |

## Next steps

To complete the PostHog setup, create an **"Analytics basics"** dashboard in your PostHog project with the following recommended insights:

1. **Todo Creation Trend** — Line chart of `todo_created` events over time to track daily task creation volume
2. **Task Completion Funnel** — Funnel from `todo_created` → `todo_completed` to measure how many created todos get completed
3. **Todo Lifecycle** — Breakdown comparing `todo_created`, `todo_completed`, `todo_reopened`, and `todo_deleted` events side-by-side
4. **Deletion Rate** — Ratio of `todo_deleted` to `todo_created` to identify churn in task management
5. **Active Users Creating Todos** — Unique users per day who fired `todo_created` to measure active engagement

You can create these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
