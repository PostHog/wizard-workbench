# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router todo application. Changes include:

- **`instrumentation-client.ts`** (new): Initializes posthog-js via Next.js 15.3+ instrumentation hook, pointing requests through the `/ingest` reverse proxy with exception capture enabled.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using posthog-node for API route tracking.
- **`next.config.ts`** (updated): Added reverse proxy rewrites for `/ingest/*` and `/ingest/static/*` and `/ingest/array/*`, plus `skipTrailingSlashRedirect: true`.
- **`components/todos/todo-list.tsx`** (updated): Added `posthog.capture()` calls in all three action handlers (`handleAddTodo`, `handleToggleTodo`, `handleDeleteTodo`) and `posthog.captureException()` in each catch block.
- **`pages/api/todos/index.ts`** (updated): Added `server_todo_created` server-side event via posthog-node on successful POST, reading `x-posthog-distinct-id` header for user correlation.
- **`pages/api/todos/[id].ts`** (updated): Added `server_todo_updated` and `server_todo_deleted` server-side events via posthog-node on successful PATCH and DELETE.

## Events

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | Fired when a user successfully submits the form to create a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks an active todo as completed. | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user unchecks a completed todo, marking it active again. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item. | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event fired when the API successfully creates a new todo. | `pages/api/todos/index.ts` |
| `server_todo_updated` | Server-side event fired when the API successfully updates a todo's completion status or details. | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server-side event fired when the API successfully deletes a todo. | `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and a dashboard to keep an eye on user behavior:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1813010)
- [Todo activity over time](https://us.posthog.com/project/483112/insights/Uw9qSgsD)
- [Todo completion funnel](https://us.posthog.com/project/483112/insights/jL8Y5OY9)
- [Todos created with description](https://us.posthog.com/project/483112/insights/YAX9EsW0)
- [Todos deleted by completion status](https://us.posthog.com/project/483112/insights/8sAMhuq7)
- [Total todos completed](https://us.posthog.com/project/483112/insights/3rq59YZX)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
