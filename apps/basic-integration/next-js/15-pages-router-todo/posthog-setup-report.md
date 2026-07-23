# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+) and captures todo lifecycle events both client-side and server-side. A reverse proxy is configured in `next.config.ts` to route PostHog requests through `/ingest` to avoid ad blockers. Server-side event tracking uses `posthog-node` in the API route handlers, with the client's distinct ID and session ID forwarded via request headers for cross-domain correlation.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | A user successfully creates a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | A user marks a todo item as completed. | `components/todos/todo-list.tsx` |
| `todo_reopened` | A user marks a completed todo item as active again. | `components/todos/todo-list.tsx` |
| `todo_deleted` | A user deletes a todo item. | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side event when a new todo is created via the API. | `pages/api/todos/index.ts` |
| `todo_updated` | Server-side event when a todo is updated via the API. | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server-side event when a todo is deleted via the API. | `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1897360)
- [Todo creation trend (wizard)](https://us.posthog.com/project/483112/insights/qAe1P3fi)
- [Todo completion trend (wizard)](https://us.posthog.com/project/483112/insights/wwsp7wrP)
- [Todo completion funnel (wizard)](https://us.posthog.com/project/483112/insights/6G5ImbIX)
- [Todo action breakdown (wizard)](https://us.posthog.com/project/483112/insights/miotSzau)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set. Required keys: `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. (This app has no auth system currently; add identify when auth is added.)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
