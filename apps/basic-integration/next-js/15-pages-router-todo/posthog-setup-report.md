<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route all PostHog requests through `/ingest`. A server-side PostHog client (`lib/posthog-server.ts`) was added using `posthog-node` to capture critical API-level events. Client-side events are captured in the todo list component for all key user interactions. Error tracking via `posthog.captureException()` was added around each async API call.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | User submits the form to create a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed. | `components/todos/todo-list.tsx` |
| `todo_reopened` | User unchecks a completed todo item, marking it active again. | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item from the list. | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event captured when a new todo is successfully created via the API. | `pages/api/todos/index.ts` |
| `server_todo_updated` | Server-side event captured when a todo is updated via the API. | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server-side event captured when a todo is deleted via the API. | `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1792487)
- [Todos Created Over Time](https://us.posthog.com/project/483112/insights/aybO2Y8X)
- [Todo Completion vs Reopening](https://us.posthog.com/project/483112/insights/pFi9kfsw)
- [Todo Creation to Completion Funnel](https://us.posthog.com/project/483112/insights/vUSXGHBW)
- [Todo Deletions Over Time](https://us.posthog.com/project/483112/insights/2Wvkgq4M)
- [All Todo Actions Overview](https://us.posthog.com/project/483112/insights/B1yLjEEH)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
