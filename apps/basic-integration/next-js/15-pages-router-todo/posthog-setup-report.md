<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route events through `/ingest` and reduce ad-blocker interference. A server-side singleton (`lib/posthog-server.ts`) enables event capture from API routes. Client-side events are captured in `components/todos/todo-list.tsx` for the three key user actions. Server-side events are captured in the two API route handlers, correlated to the same client session via the `X-POSTHOG-DISTINCT-ID` tracing header automatically injected by posthog-js.

| Event name | Description | File |
|---|---|---|
| `todo_added` | User successfully adds a new todo item via the form | `components/todos/todo-list.tsx` |
| `todo_toggled` | User checks or unchecks a todo item to change its completion status | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item from the list | `components/todos/todo-list.tsx` |
| `todo_created` | Server confirms a new todo was successfully created via the API | `pages/api/todos/index.ts` |
| `todo_updated` | Server confirms a todo was successfully updated via the API | `pages/api/todos/[id].ts` |
| `todo_removed` | Server confirms a todo was successfully deleted via the API | `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1897426)
- [Todo actions trend (wizard)](https://us.posthog.com/project/483112/insights/UBk2WHJ9)
- [Todo actions funnel (wizard)](https://us.posthog.com/project/483112/insights/gLfXhGEJ)
- [Todo created vs deleted (wizard)](https://us.posthog.com/project/483112/insights/ybS4Suix)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
