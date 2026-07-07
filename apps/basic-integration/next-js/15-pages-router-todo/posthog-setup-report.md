<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for this Next.js 15 Pages Router todo application. Here is what was set up:

- **`instrumentation-client.ts`** — Client-side PostHog initialization using the Next.js 15.3+ instrumentation hook. Initializes posthog-js with a reverse proxy (`/ingest`), exception auto-capture, and debug mode in development.
- **`next.config.ts`** — Added reverse-proxy rewrites for `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*` so PostHog requests route through your own domain and avoid ad blockers. Also enabled `skipTrailingSlashRedirect`.
- **`lib/posthog-server.ts`** — Singleton server-side PostHog client using `posthog-node`, configured with `flushAt: 1` and `flushInterval: 0` so events are sent immediately in serverless API routes.
- **`components/todos/todo-list.tsx`** — Added four client-side `posthog.capture()` calls for key user actions plus `posthog.captureException()` in error handlers. Fetch calls now pass `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers so server events are correlated with the same user session.
- **`pages/api/todos/index.ts`** — Added server-side `server_todo_created` tracking in the POST handler.
- **`pages/api/todos/[id].ts`** — Added server-side `server_todo_updated` and `server_todo_deleted` tracking in the PATCH and DELETE handlers.
- **`.env.local`** — Created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

## Events

| Event name | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as complete. | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo item as active again. | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item. | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server records creation of a new todo via the POST API route. | `pages/api/todos/index.ts` |
| `server_todo_updated` | Server records an update to a todo's status or content via the PATCH API route. | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server records deletion of a todo via the DELETE API route. | `pages/api/todos/[id].ts` |

## Next steps

We've built a dashboard and five insights for you to keep an eye on user behavior:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1811948)
- [Todo Actions Over Time](https://us.posthog.com/project/483112/insights/oQef2TCP) — Line graph of creates, completions, and deletes per day
- [Todo Completion Funnel](https://us.posthog.com/project/483112/insights/HrMWLcWF) — Funnel from `todo_created` → `todo_completed`
- [Todo Deletion Rate](https://us.posthog.com/project/483112/insights/Pre3h2pY) — Bar chart of daily deletions (churn signal)
- [Todos Created With Description](https://us.posthog.com/project/483112/insights/swYlZfLF) — Breakdown by whether a description was added
- [Active Todo Users](https://us.posthog.com/project/483112/insights/0TYA7UWI) — Daily unique users creating todos

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
