<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router todo application. The following changes were made:

- **`instrumentation-client.ts`** — Created to initialize PostHog client-side using the `posthog-js` SDK. Uses the `/ingest` reverse proxy, enables exception capture for error tracking, and runs in debug mode during development.
- **`next.config.ts`** — Updated with reverse proxy rewrites routing `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*` to PostHog's ingestion endpoints, plus `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** — Created a server-side PostHog client singleton using `posthog-node` for capturing events from API routes.
- **`components/todos/todo-list.tsx`** — Added `todo_created`, `todo_completed`, `todo_reopened`, and `todo_deleted` events with relevant properties. Also added `captureException` error tracking in each handler's catch block.
- **`pages/api/todos/index.ts`** — Added `server_todo_created` server-side event on successful POST.
- **`pages/api/todos/[id].ts`** — Added `server_todo_updated` and `server_todo_deleted` server-side events on successful PATCH and DELETE.
- **`.env.local`** — Created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | A user successfully creates a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | A user marks a todo item as completed. | `components/todos/todo-list.tsx` |
| `todo_reopened` | A user marks a completed todo item as incomplete. | `components/todos/todo-list.tsx` |
| `todo_deleted` | A user deletes a todo item. | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server records a new todo item being created via the API. | `pages/api/todos/index.ts` |
| `server_todo_updated` | Server records a todo item being updated via the API. | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server records a todo item being deleted via the API. | `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793494)
- [Todo Activity Overview (wizard)](https://us.posthog.com/project/483112/insights/MaFFjmuX) — All todo actions over time (line chart)
- [Todos Created vs Completed (wizard)](https://us.posthog.com/project/483112/insights/K25SuQlx) — Side-by-side bar chart
- [Todo Completion Rate (wizard)](https://us.posthog.com/project/483112/insights/mRtgK7h8) — Percentage of todos completed (BoldNumber)
- [Todo Deletion Rate (wizard)](https://us.posthog.com/project/483112/insights/QDx0OPe0) — Percentage of todos deleted (BoldNumber)
- [Daily Active Todo Users (wizard)](https://us.posthog.com/project/483112/insights/3pb4KeJb) — Unique users creating and completing todos per day

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
