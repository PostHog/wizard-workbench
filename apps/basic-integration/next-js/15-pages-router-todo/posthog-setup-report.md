<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route all PostHog requests through `/ingest` — improving reliability by reducing ad-blocker interference. A server-side PostHog client was created in `lib/posthog-server.ts` using `posthog-node`. Client-side events are captured in `components/todos/todo-list.tsx` for all four core user actions (creating, completing, reopening, and deleting todos). The client passes its `distinct_id` and `session_id` as `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` request headers so server-side events in the API routes are correlated to the same anonymous user.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo item via the add todo form. | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks an active todo item as completed. | `components/todos/todo-list.tsx` |
| `todo_reopened` | User marks a completed todo item as active again. | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item from the list. | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side event when a new todo is created via the API. | `pages/api/todos/index.ts` |
| `todo_updated` | Server-side event when a todo is updated via the API. | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server-side event when a todo is deleted via the API. | `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818149)
- [Todo Activity Over Time (wizard)](https://us.posthog.com/project/483112/insights/frnVOs56)
- [Todos Created per Day (wizard)](https://us.posthog.com/project/483112/insights/LXAweicC)
- [Todo Completion Funnel (wizard)](https://us.posthog.com/project/483112/insights/wo9mc09v)
- [Todo Completion vs Reopened (wizard)](https://us.posthog.com/project/483112/insights/cpRaBuP1)
- [Active Todo Users (wizard)](https://us.posthog.com/project/483112/insights/yCjRxMur)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
