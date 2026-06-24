# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo app. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the Next.js 15.3+ instrumentation API. Configured with a reverse proxy path (`/ingest`), exception capture, and debug mode in development.
- **`next.config.ts`**: Added reverse proxy rewrites for `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*` to route PostHog traffic through the app and avoid ad-blockers.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node`, shared across API route handlers.
- **`components/todos/todo-list.tsx`**: Added `posthog.capture()` calls for all four key user actions — creating, completing, reopening, and deleting todos.
- **`pages/api/todos/index.ts`**: Added server-side `todo_created` event on successful POST, using the `x-posthog-distinct-id` request header for user correlation.
- **`pages/api/todos/[id].ts`**: Added server-side `todo_updated` and `todo_deleted` events on successful PATCH and DELETE.

| Event | Description | File |
|---|---|---|
| `todo_created` | Fires when a user successfully creates a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | Fires when a user marks an active todo as completed. | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fires when a user unchecks a completed todo to mark it active again. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fires when a user successfully deletes a todo item. | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side confirmation that a new todo was successfully persisted via the API. | `pages/api/todos/index.ts` |
| `todo_updated` | Server-side confirmation that a todo was successfully updated via the API. | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server-side confirmation that a todo was successfully deleted via the API. | `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1751155)
  - Todo Creation Trend — `todo_created` events over time
  - Todo Completion Rate — funnel from `todo_created` → `todo_completed`
  - Todo Deletion Trend — `todo_deleted` over time
  - Active vs Completed Todos — bar chart comparing `todo_created` vs `todo_completed` counts
  - Todo Churn (Deletions) — total `todo_deleted` count

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
