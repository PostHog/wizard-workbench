# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router todo application. The following changes were made:

- **`instrumentation-client.ts`** — Created at the project root to initialize PostHog client-side using the `posthog-js` SDK. Configured with a reverse proxy (`/ingest`), exception auto-capture, and debug mode in development.
- **`next.config.ts`** — Added rewrites to proxy PostHog requests through `/ingest/*` to avoid ad-blocker interference, including both static assets (`/ingest/static/*`, `/ingest/array/*`) and the ingestion endpoint.
- **`lib/posthog-server.ts`** — Created a singleton `getPostHogClient()` helper for server-side event capture using `posthog-node`, configured for Next.js short-lived functions (`flushAt: 1`, `flushInterval: 0`).
- **`components/todos/todo-list.tsx`** — Added four client-side `posthog.capture()` calls in event handlers (`handleAddTodo`, `handleToggleTodo`, `handleDeleteTodo`). The PostHog distinct ID and session ID are forwarded to API routes via `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` request headers for client–server event correlation.
- **`app/api/todos/route.ts`** — Added server-side `server_todo_created` capture in the `POST` handler, reading the distinct ID from the forwarded header.
- **`app/api/todos/[id]/route.ts`** — Added server-side `server_todo_updated` and `server_todo_deleted` captures in the `PATCH` and `DELETE` handlers respectively.
- **`.env.local`** — Populated `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `todo_created` | User successfully adds a new todo item via the form. | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed by checking its checkbox. | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo item as incomplete by unchecking its checkbox. | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item by clicking the delete button. | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server successfully creates a new todo via the POST API route. | `app/api/todos/route.ts` |
| `server_todo_updated` | Server successfully updates a todo's properties via the PATCH API route. | `app/api/todos/[id]/route.ts` |
| `server_todo_deleted` | Server successfully deletes a todo via the DELETE API route. | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1813009)
- [Todos created over time](https://us.posthog.com/project/483112/insights/LgtKzk7D)
- [Todo activity overview](https://us.posthog.com/project/483112/insights/OYPXXgDi)
- [Todo completion funnel](https://us.posthog.com/project/483112/insights/bi3il56k)
- [Todos created by description presence](https://us.posthog.com/project/483112/insights/ZZBPgGNh)
- [Todo deletion rate](https://us.posthog.com/project/483112/insights/s0MNcc5w)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
