# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router todo application. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route events through `/ingest` and avoid ad blockers. A server-side helper (`lib/posthog-server.ts`) uses `posthog-node` to track API-layer events. Client-side and server-side events are correlated using `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers passed from the browser to every API route. Exception capture is enabled globally via `capture_exceptions: true`.

| Event name | Description | File |
|---|---|---|
| `todo_created` | Fired client-side when a user successfully creates a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks an active todo item as completed. | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user marks a completed todo item as active again. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired client-side when a user successfully deletes a todo item. | `components/todos/todo-list.tsx` |
| `todo_created` | Fired server-side when the API successfully creates a new todo item. | `app/api/todos/route.ts` |
| `todo_updated` | Fired server-side when the API successfully updates a todo item's completion status. | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Fired server-side when the API successfully deletes a todo item. | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1812606)
- [Todo activity over time](https://us.posthog.com/project/483112/insights/9zYA3ACg) — Daily trend of creates, completions, and deletions
- [Todo completion funnel](https://us.posthog.com/project/483112/insights/zsYbRQ7t) — Conversion from creating a todo to completing it
- [Todos created with description](https://us.posthog.com/project/483112/insights/3KNNjGbK) — Breakdown by whether users add a description
- [Todo deletion rate](https://us.posthog.com/project/483112/insights/rpk0jvOc) — Weekly comparison of deletions vs creations (task churn)
- [Unique active users](https://us.posthog.com/project/483112/insights/jWcaK2S3) — Daily active users tracked by todo creation

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
