# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes posthog-js for client-side tracking using Next.js 15.3+ instrumentation. Configured with a reverse proxy (`/ingest`), exception autocapture, and debug mode in development.
- **`lib/posthog-server.ts`** (new): Singleton posthog-node client for server-side event capture in API routes.
- **`next.config.ts`** (updated): Added reverse proxy rewrites for `/ingest/*` → PostHog ingestion endpoints, plus `skipTrailingSlashRedirect: true`.
- **`components/todos/todo-list.tsx`** (updated): Added four client-side capture calls — `todo_created`, `todo_completed`, `todo_reopened`, `todo_deleted` — plus `captureException` in each error handler.
- **`pages/api/todos/index.ts`** (updated): Added server-side `server_todo_created` event on successful POST.
- **`pages/api/todos/[id].ts`** (updated): Added server-side `server_todo_updated` and `server_todo_deleted` events on successful PATCH and DELETE.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | A user successfully created a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | A user marked a todo item as completed. | `components/todos/todo-list.tsx` |
| `todo_reopened` | A user unchecked a completed todo item, marking it active again. | `components/todos/todo-list.tsx` |
| `todo_deleted` | A user deleted a todo item. | `components/todos/todo-list.tsx` |
| `server_todo_created` | A new todo was successfully persisted via the API. | `pages/api/todos/index.ts` |
| `server_todo_updated` | A todo was updated (title, description, or completion status) via the API. | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | A todo was deleted via the API. | `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1811314)
- [Todo activity over time](https://us.posthog.com/project/483112/insights/v3T09BxZ)
- [Todo completion funnel](https://us.posthog.com/project/483112/insights/DFoTt2V3)
- [Todos created by description](https://us.posthog.com/project/483112/insights/GJqkWyIh)
- [Todo completion vs reopened](https://us.posthog.com/project/483112/insights/roo1qa36)
- [Total todos created](https://us.posthog.com/project/483112/insights/7fpx4JJ4)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
