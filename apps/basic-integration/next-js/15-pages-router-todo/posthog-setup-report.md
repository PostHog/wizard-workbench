# PostHog post-wizard report

The wizard has completed a full PostHog integration for this Next.js 15 Pages Router todo app. The following changes were made:

- **Installed** `posthog-js` (client-side) and `posthog-node` (server-side) via pnpm.
- **Created** `instrumentation-client.ts` — initializes PostHog on the client with the reverse proxy host, exception capture, and the `2026-01-30` defaults.
- **Updated** `next.config.ts` — added reverse proxy rewrites for `/ingest/*` and `/ingest/static/*` and `/ingest/array/*` so analytics traffic routes through Next.js and avoids ad blockers.
- **Created** `lib/posthog-server.ts` — singleton `posthog-node` client for server-side event capture.
- **Edited** `components/todos/todo-list.tsx` — added client-side `posthog.capture()` calls for all user actions (create, complete, uncomplete, delete), passing `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to the API routes so client and server events correlate. Also added `posthog.captureException()` in error handlers.
- **Edited** `pages/api/todos/index.ts` — added server-side `server_todo_created` event on successful POST.
- **Edited** `pages/api/todos/[id].ts` — added server-side `server_todo_updated` and `server_todo_deleted` events on successful PATCH and DELETE.

## Events

| Event | Description | File |
|---|---|---|
| `todo_created` | User submits a new todo item via the add todo form. | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed by toggling its checkbox. | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo item as incomplete by toggling its checkbox. | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item by clicking the delete button. | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server records the creation of a new todo item via the POST API route. | `pages/api/todos/index.ts` |
| `server_todo_updated` | Server records an update to an existing todo item via the PATCH API route. | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server records the deletion of a todo item via the DELETE API route. | `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1812597)
- [Todo actions over time](https://us.posthog.com/project/483112/insights/pGH73eWN)
- [Todo completion funnel](https://us.posthog.com/project/483112/insights/OF6CrmyQ)
- [Todo churn: deleted vs created](https://us.posthog.com/project/483112/insights/D3vQxEbL)
- [Todos created with descriptions](https://us.posthog.com/project/483112/insights/vZzNb8pu)
- [Server-side todo events](https://us.posthog.com/project/483112/insights/epxFzYzl)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
