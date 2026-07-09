<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for this Next.js 15 Pages Router todo application. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), which sets up autocapture, session replay, and error tracking automatically. A reverse proxy was added to `next.config.ts` so all PostHog requests route through `/ingest/*`, bypassing ad blockers. A server-side PostHog client (`lib/posthog-server.ts`) was created using `posthog-node`, and client-to-server distinct ID correlation is achieved by passing `X-PostHog-Distinct-ID` and `X-PostHog-Session-ID` headers on every API request from the client component.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed. | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired when a user marks a completed todo as incomplete. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item. | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event fired when a todo is successfully created via the API. | `pages/api/todos/index.ts` |
| `server_todo_completed` | Server-side event fired when a todo is marked as completed via the API. | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server-side event fired when a todo is successfully deleted via the API. | `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1824520)
- [Todo actions over time](https://us.posthog.com/project/483112/insights/9miqnw9X)
- [Todo completion funnel](https://us.posthog.com/project/483112/insights/cpfTKKvX)
- [Todo deletion rate](https://us.posthog.com/project/483112/insights/vEWFZLZI)
- [Daily active todo users](https://us.posthog.com/project/483112/insights/XtndBvyx)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
