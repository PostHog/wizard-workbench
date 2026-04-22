<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the `posthog-js` SDK with a reverse proxy (`/ingest`), exception capture enabled, and debug mode in development.
- **`next.config.ts`** (updated): Added reverse proxy rewrites routing `/ingest/*` to PostHog servers, reducing ad-blocker interference and improving event reliability.
- **`lib/posthog-server.ts`** (new): Server-side PostHog singleton client using `posthog-node`, configured with `flushAt: 1` and `flushInterval: 0` for immediate event delivery in API routes.
- **`components/todos/todo-list.tsx`** (updated): Added client-side event capture for all core todo actions — creation, completion, re-opening, and deletion — plus `captureException` for error tracking in catch blocks.
- **`pages/api/todos/index.ts`** (updated): Added server-side `todo_created` capture in the POST handler, correlating with client sessions via `X-PostHog-Distinct-ID` and `X-PostHog-Session-ID` headers.
- **`pages/api/todos/[id].ts`** (updated): Added server-side `todo_deleted` capture in the DELETE handler with the same session correlation headers.
- **`.env.local`** (updated): Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired when a user marks a completed todo as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: fired when a new todo is successfully created via API | `pages/api/todos/index.ts` |
| `todo_deleted` | Server-side: fired when a todo is successfully deleted via API | `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1346453)
- [Todo Creation Rate — trend of `todo_created` over time](https://us.posthog.com/project/2/insights?insight=TRENDS&events=[{"id":"todo_created","type":"events"}]&date_from=-30d)
- [Todo Completion Rate — trend of `todo_completed` over time](https://us.posthog.com/project/2/insights?insight=TRENDS&events=[{"id":"todo_completed","type":"events"}]&date_from=-30d)
- [Todo Creation to Completion funnel](https://us.posthog.com/project/2/insights?insight=FUNNELS&events=[{"id":"todo_created","type":"events"},{"id":"todo_completed","type":"events"}]&date_from=-30d)
- [Todo Deletion trend](https://us.posthog.com/project/2/insights?insight=TRENDS&events=[{"id":"todo_deleted","type":"events"}]&date_from=-30d)
- [Todo Reopen Rate](https://us.posthog.com/project/2/insights?insight=TRENDS&events=[{"id":"todo_reopened","type":"events"}]&date_from=-30d)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
