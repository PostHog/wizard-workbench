<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router Todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Client-side PostHog initialization using the Next.js 15.3+ `instrumentation-client` convention. Configures a reverse proxy via `/ingest`, enables exception capture, and turns on debug mode in development.
- **`lib/posthog-server.ts`** (new): Server-side PostHog singleton client using `posthog-node`, configured with `flushAt: 1` and `flushInterval: 0` for immediate event flushing in Next.js API routes.
- **`next.config.ts`** (updated): Added reverse proxy rewrites for PostHog ingestion (`/ingest/*` → `us.i.posthog.com`) and `skipTrailingSlashRedirect: true`.
- **`components/todos/todo-list.tsx`** (updated): Added four client-side capture events on successful API responses, plus `captureException` in error catch blocks.
- **`app/api/todos/route.ts`** (updated): Added server-side `server_todo_created` capture on successful todo creation.
- **`app/api/todos/[id]/route.ts`** (updated): Added server-side `server_todo_updated` and `server_todo_deleted` captures on successful update and deletion.
- **`.env.local`** (updated): `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables set.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | Fired on the client when the user successfully adds a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired on the client when the user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired on the client when the user marks a completed todo as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired on the client when the user successfully deletes a todo item | `components/todos/todo-list.tsx` |
| `server_todo_created` | Fired server-side when a new todo is successfully persisted via POST /api/todos | `app/api/todos/route.ts` |
| `server_todo_updated` | Fired server-side when a todo is successfully updated via PATCH /api/todos/[id] | `app/api/todos/[id]/route.ts` |
| `server_todo_deleted` | Fired server-side when a todo is successfully deleted via DELETE /api/todos/[id] | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **[Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1195065)** — Overview of core todo app analytics including conversions and user engagement
  - [Todo Activity Overview](https://us.posthog.com/project/2/insights/X1GrGf0U) — Daily trend of todos created, completed, and deleted
  - [Todo Completion Funnel](https://us.posthog.com/project/2/insights/wQrzcm5m) — Funnel showing conversion from creating a todo to completing it (todo_created → todo_completed)
  - [Server-Side Events](https://us.posthog.com/project/2/insights/zM32JSUp) — Daily trend of server_todo_created, server_todo_updated, and server_todo_deleted

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
