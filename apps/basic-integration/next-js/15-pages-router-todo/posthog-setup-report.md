# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router todo app. Here is a summary of what was added:

- **`instrumentation-client.ts`** — Created to initialize `posthog-js` on the client side via Next.js 15.3+ instrumentation. Uses a reverse proxy (`/ingest`) to improve reliability, enables exception autocapture, and reads credentials from environment variables.
- **`next.config.ts`** — Updated with reverse-proxy rewrites for `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*`, plus `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** — Created a singleton `posthog-node` client for server-side tracking with `flushAt: 1` and `flushInterval: 0` for serverless-safe flushing.
- **`components/todos/todo-list.tsx`** — Added client-side `posthog.capture()` calls for all four core todo user actions. The PostHog distinct ID is forwarded as `X-PostHog-Distinct-Id` in every API request so server events correlate with the same user.
- **`pages/api/todos/index.ts`** — Added `server_todo_created` capture on successful POST.
- **`pages/api/todos/[id].ts`** — Added `server_todo_updated` capture on successful PATCH and `server_todo_deleted` capture on successful DELETE.

| Event | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks an active todo as completed. | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired when a user unchecks a completed todo to mark it active again. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item. | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event fired when a new todo is successfully persisted via the API. | `pages/api/todos/index.ts` |
| `server_todo_updated` | Server-side event fired when a todo is updated via the API. | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server-side event fired when a todo is deleted via the API. | `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1812151)
- [Todo activity over time (wizard)](https://us.posthog.com/project/483112/insights/uwcAw2gC)
- [Task completion funnel (wizard)](https://us.posthog.com/project/483112/insights/6AJ8QUty)
- [Todos deleted — by completion status (wizard)](https://us.posthog.com/project/483112/insights/suVI62qc)
- [Server-side todo operations (wizard)](https://us.posthog.com/project/483112/insights/TSF3Nx5C)
- [Todos with descriptions (wizard)](https://us.posthog.com/project/483112/insights/oRKZwDLv)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
