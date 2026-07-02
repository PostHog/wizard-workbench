<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for this Next.js 15 App Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new) — initialises PostHog on the client side using the Next.js 15.3+ `instrumentation-client` pattern, with the reverse proxy host, error tracking (`capture_exceptions`), and debug mode in development.
- **`next.config.ts`** (updated) — added `/ingest/*` rewrites to proxy PostHog requests through the app, preventing ad blockers from blocking event collection. Both `/ingest/static/*` and `/ingest/array/*` are routed to the assets origin as required.
- **`lib/posthog-server.ts`** (new) — singleton PostHog Node.js client used by API routes for server-side event capture, with `flushAt: 1` and `flushInterval: 0` for immediate delivery in serverless environments.
- **`components/todos/todo-list.tsx`** (updated) — added `posthog.capture()` calls in all three mutation handlers (`handleAddTodo`, `handleToggleTodo`, `handleDeleteTodo`). Each request also forwards `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to correlate client and server events for the same user. `posthog.captureException()` added in catch blocks for error tracking.
- **`app/api/todos/route.ts`** (updated) — captures `server_todo_created` after a successful POST, reading the distinct ID and session ID from the forwarded headers.
- **`app/api/todos/[id]/route.ts`** (updated) — captures `server_todo_updated` after a successful PATCH and `server_todo_deleted` after a successful DELETE, both with the forwarded distinct/session IDs.
- **`.env.local`** (new) — `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` added.

| Event name | Description | File |
|---|---|---|
| `todo_created` | User submits a new todo item through the add todo form. | `components/todos/todo-list.tsx` |
| `todo_completed` | User checks a todo item to mark it as completed. | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User unchecks a completed todo item to mark it as active again. | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item from the list. | `components/todos/todo-list.tsx` |
| `server_todo_created` | A new todo was successfully persisted via the API route. | `app/api/todos/route.ts` |
| `server_todo_updated` | A todo was successfully updated via the API route. | `app/api/todos/[id]/route.ts` |
| `server_todo_deleted` | A todo was successfully deleted via the API route. | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1792820)
- [Todo Actions Over Time](https://us.posthog.com/project/483112/insights/pxlod25T)
- [Total Todos Created](https://us.posthog.com/project/483112/insights/4e00tcFA)
- [Todo Completion Rate](https://us.posthog.com/project/483112/insights/ymaW37w6)
- [Todo Churn: Deleted vs Created](https://us.posthog.com/project/483112/insights/r2kPbxaJ)
- [Unique Active Users](https://us.posthog.com/project/483112/insights/GauXWCt6)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
