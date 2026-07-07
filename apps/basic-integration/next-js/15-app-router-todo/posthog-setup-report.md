# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes posthog-js on the client side using the Next.js 15.3+ instrumentation API, with reverse-proxy routing, exception capture, and debug mode in development.
- **`next.config.ts`**: Added reverse proxy rewrites for `/ingest/*` so PostHog requests are routed through the app, avoiding ad blockers. Also set `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new): Singleton `getPostHogClient()` that returns a `posthog-node` client for server-side event capture in API routes.
- **`components/todos/todo-list.tsx`**: Added `posthog.capture()` calls for `todo_created`, `todo_completed`, `todo_uncompleted`, and `todo_deleted`. Passes `posthog.get_distinct_id()` via the `X-POSTHOG-DISTINCT-ID` header to API routes for client–server correlation. Added `posthog.captureException()` in error handlers.
- **`app/api/todos/route.ts`**: Added server-side `todo_created` capture in the POST handler, reading the distinct ID from the `X-POSTHOG-DISTINCT-ID` header.
- **`app/api/todos/[id]/route.ts`**: Added server-side `todo_updated` capture in the PATCH handler and `todo_deleted` capture in the DELETE handler.
- **`.env.local`**: Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

| Event name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully adds a new todo item via the form. | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed by checking its checkbox. | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user unchecks a completed todo, marking it active again. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item. | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side event fired when a new todo is persisted via the POST /api/todos route. | `app/api/todos/route.ts` |
| `todo_updated` | Server-side event fired when a todo is updated via the PATCH /api/todos/[id] route. | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side event fired when a todo is deleted via the DELETE /api/todos/[id] route. | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1811950)
- [Todos created over time (wizard)](https://us.posthog.com/project/483112/insights/QMAS4ocM)
- [Todo completion rate (wizard)](https://us.posthog.com/project/483112/insights/HIlzqfFH)
- [Todo created → completed funnel (wizard)](https://us.posthog.com/project/483112/insights/Cy8YxDHx)
- [Todo deletions over time (wizard)](https://us.posthog.com/project/483112/insights/QcbeOvqW)
- [All todo actions (wizard)](https://us.posthog.com/project/483112/insights/ix3hBjR8)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
