<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router todo application. PostHog is initialized client-side via `instrumentation-client.ts` (Next.js 15.3+ pattern), with a reverse proxy configured in `next.config.ts` to route analytics traffic through `/ingest`. A singleton server-side client in `lib/posthog-server.ts` captures events from the API routes. Environment variables are stored in `.env.local`. Client-side events are captured in `components/todos/todo-list.tsx` for all four core user actions, with exception tracking added to each error path. Server-side counterpart events are captured in both API route handlers.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | Fired on the client when a user successfully creates a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired on the client when a user marks an active todo as completed. | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired on the client when a user unchecks a completed todo to mark it active again. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired on the client when a user deletes a todo item. | `components/todos/todo-list.tsx` |
| `server_todo_created` | Fired server-side when the POST /api/todos endpoint successfully creates a new todo. | `pages/api/todos/index.ts` |
| `server_todo_updated` | Fired server-side when the PATCH /api/todos/[id] endpoint successfully updates a todo. | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Fired server-side when the DELETE /api/todos/[id] endpoint successfully deletes a todo. | `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1795736)
- [Todo Actions Over Time](https://us.posthog.com/project/483112/insights/9XftnzPg) — Daily trend of all todo actions (created, completed, reopened, deleted)
- [Todos Created (Total)](https://us.posthog.com/project/483112/insights/AimgmzOW) — Total todos created in the last 30 days (bold number)
- [Todo Completion Rate](https://us.posthog.com/project/483112/insights/0QHvh68d) — Percentage of todos marked complete vs. created
- [Todo Deletion Rate](https://us.posthog.com/project/483112/insights/VeeaXyzA) — Percentage of todos deleted vs. created (churn signal)
- [Unique Users Taking Todo Actions](https://us.posthog.com/project/483112/insights/K9XL19tI) — DAU broken down by action type

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
