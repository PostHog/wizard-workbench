# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo app. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), using a reverse proxy configured in `next.config.ts` to route events through `/ingest` and avoid ad blockers. A server-side PostHog client (`lib/posthog-server.ts`) handles event capture in API route handlers. Client-side events are captured in `todo-list.tsx` for all todo interactions, and the PostHog distinct ID is forwarded to the API via `X-POSTHOG-DISTINCT-ID` headers so server-side events are correlated to the same user session.

| Event name | Description | File |
|---|---|---|
| `todo_added` | User successfully adds a new todo item from the client-side form. | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks an active todo as completed by checking the checkbox. | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo back to active by unchecking the checkbox. | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item by clicking the delete button. | `components/todos/todo-list.tsx` |
| `todo_created` | Server confirms a new todo was successfully persisted via the POST API route. | `app/api/todos/route.ts` |
| `todo_updated` | Server confirms a todo was successfully updated via the PATCH API route. | `app/api/todos/[id]/route.ts` |
| `todo_removed` | Server confirms a todo was successfully deleted via the DELETE API route. | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1897427)
- [Todos added (wizard)](https://us.posthog.com/project/483112/insights/oKRAnypx)
- [Todo completion funnel (wizard)](https://us.posthog.com/project/483112/insights/YDShbahw)
- [Todo actions breakdown (wizard)](https://us.posthog.com/project/483112/insights/Yw18ZPkn)
- [Todos deleted (wizard)](https://us.posthog.com/project/483112/insights/rKMalryH)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
