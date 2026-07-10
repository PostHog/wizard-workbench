# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 15 Pages Router todo application with PostHog. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route analytics through `/ingest` and reduce ad-blocker interference. A server-side PostHog client was added in `lib/posthog-server.ts` using `posthog-node`. Client-side events are captured in `components/todos/todo-list.tsx`, and server-side events are captured in both API route handlers. The client passes its `distinct_id` and `session_id` to the server via `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` request headers so client and server events are correlated to the same user.

| Event | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks an active todo item as completed. | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired when a user unchecks a completed todo item to mark it active again. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item. | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side capture when a todo is created via POST /api/todos. | `pages/api/todos/index.ts` |
| `todo_updated` | Server-side capture when a todo is updated via PATCH /api/todos/[id]. | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server-side capture when a todo is deleted via DELETE /api/todos/[id]. | `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1829267)
- **Todo creations over time:** [Line chart of daily todo_created events](https://us.posthog.com/project/483112/insights/KDUprPaV)
- **Todo completion vs deletion:** [Bar chart comparing completed vs deleted per day](https://us.posthog.com/project/483112/insights/4ntlot33)
- **Todo actions overview:** [Stacked bar of all four todo actions over time](https://us.posthog.com/project/483112/insights/jQEt0mhE)
- **Todo completion funnel:** [Funnel from todo_created → todo_completed](https://us.posthog.com/project/483112/insights/r7dbnC08)
- **Todos deleted:** [Bold number — total deletion count as a churn signal](https://us.posthog.com/project/483112/insights/7kuK5TXj)

Dashboard subscription and alerts were skipped — the consent tool was unavailable during this run. To set them up manually, visit your [dashboard](https://us.posthog.com/project/483112/dashboard/1829267) and use the Subscribe and Alerts options in the dashboard menu.

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` (or any monorepo bootstrap scripts) so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify in PostHog Error Tracking.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
