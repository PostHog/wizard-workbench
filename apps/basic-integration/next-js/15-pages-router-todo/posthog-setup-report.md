<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router todo application. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route analytics traffic through `/ingest`. Server-side event capture is handled via `lib/posthog-server.ts` using `posthog-node`. Client-side events are captured in `components/todos/todo-list.tsx` for all user actions, and server-side events are captured in the API routes. Client requests pass `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers so client and server events can be correlated.

| Event Name | Description | File |
|---|---|---|
| `todo_added` | User submitted the form to add a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | User checked the checkbox to mark a todo as completed. | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User unchecked the checkbox to reactivate a completed todo. | `components/todos/todo-list.tsx` |
| `todo_deleted` | User clicked the delete button to remove a todo item. | `components/todos/todo-list.tsx` |
| `todo_created` | Server confirmed a new todo was created via the POST API route. | `pages/api/todos/index.ts` |
| `todo_updated` | Server confirmed a todo was updated via the PATCH API route. | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server confirmed a todo was deleted via the DELETE API route. | `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1787402)
- [Todos Added Over Time](https://us.posthog.com/project/483112/insights/9743415)
- [Todo Completion Funnel](https://us.posthog.com/project/483112/insights/9743426)
- [Todo Deletions Over Time](https://us.posthog.com/project/483112/insights/9743428)
- [Todo Actions Breakdown](https://us.posthog.com/project/483112/insights/9743429)
- [Todos with Descriptions](https://us.posthog.com/project/483112/insights/9743432)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
