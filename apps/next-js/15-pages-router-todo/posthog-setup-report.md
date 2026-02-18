<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Client-side PostHog initialization using the recommended Next.js 15.3+ `instrumentation-client` approach. Configures a reverse proxy via `/ingest`, enables error tracking (`capture_exceptions`), and turns on debug logging in development.
- **`next.config.ts`**: Added reverse proxy rewrites for `/ingest/*` → `https://us.i.posthog.com/*` and `/ingest/static/*` → `https://us-assets.i.posthog.com/static/*`, plus `skipTrailingSlashRedirect: true` required by PostHog.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node`, with `flushAt: 1` and `flushInterval: 0` to ensure immediate flushing in short-lived API routes.
- **`components/todos/todo-list.tsx`**: Added client-side `posthog.capture()` calls for all four core todo actions, plus `posthog.captureException()` in each error handler.
- **`pages/api/todos/index.ts`**: Added server-side `server_todo_created` event on successful POST.
- **`pages/api/todos/[id].ts`**: Added server-side `server_todo_updated` on PATCH and `server_todo_deleted` on DELETE, each followed by `await posthog.shutdown()`.
- **`.env.local`**: Created with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` (gitignored).

| Event Name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side: new todo persisted via POST /api/todos | `pages/api/todos/index.ts` |
| `server_todo_updated` | Server-side: todo updated via PATCH /api/todos/[id] | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server-side: todo deleted via DELETE /api/todos/[id] | `pages/api/todos/[id].ts` |

## Next steps

To explore dashboards and insights based on these events, log in to your PostHog project at [https://us.posthog.com](https://us.posthog.com) and navigate to **Insights**. Suggested analyses:

- **Todo creation funnel**: `todo_created` → `todo_completed` — see how many todos get finished
- **Deletion rate**: `todo_deleted` vs `todo_created` — measure churn of tasks
- **Completion trend**: `todo_completed` over time — track productivity patterns
- **Server vs client event correlation**: Compare `server_todo_created` with `todo_created` to verify event parity
- **Error tracking**: View captured exceptions in the **Error Tracking** section of PostHog

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
