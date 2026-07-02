# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router todo application. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route events through `/ingest`. Server-side tracking uses `posthog-node` via a shared client in `lib/posthog-server.ts`. Client-side events are captured in the `TodoList` component for all user interactions, and the `X-POSTHOG-DISTINCT-ID` / `X-POSTHOG-SESSION-ID` headers are forwarded to each API route so server-side events can be correlated to the same session.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | User submitted the form to create a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | User checked a todo item to mark it as completed. | `components/todos/todo-list.tsx` |
| `todo_reopened` | User unchecked a completed todo item to reopen it. | `components/todos/todo-list.tsx` |
| `todo_deleted` | User clicked the delete button to remove a todo item. | `components/todos/todo-list.tsx` |
| `todo_created` | A new todo was successfully persisted via the API route. | `app/api/todos/route.ts` |
| `todo_updated` | An existing todo was successfully updated via the API route. | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | A todo was successfully deleted via the API route. | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/228144/dashboard/1792634)
- [Todo Activity Over Time](https://us.posthog.com/project/228144/insights/rzLpmjtx)
- [Total Todos Created (Last 30 Days)](https://us.posthog.com/project/228144/insights/rAnu6FU7)
- [Todo Completion Funnel](https://us.posthog.com/project/228144/insights/dw98Q5bL)
- [Todo Deletion Rate](https://us.posthog.com/project/228144/insights/0CbUh4X3)
- [Todo Completion vs Reopened](https://us.posthog.com/project/228144/insights/LP3l9xXL)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
