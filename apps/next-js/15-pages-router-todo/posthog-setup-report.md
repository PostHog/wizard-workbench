<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router Todo application. The integration covers client-side event tracking, server-side event tracking via API routes, automatic error capture, and a reverse proxy configuration to improve reliability.

**Changes made:**

- **`instrumentation-client.ts`** (new) — Initializes PostHog client-side using `posthog-js` with the reverse proxy (`/ingest`), automatic exception capture, and debug mode in development.
- **`next.config.ts`** (updated) — Added reverse proxy rewrites routing `/ingest/*` to PostHog ingestion servers, plus `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new) — Singleton server-side PostHog client using `posthog-node` with `flushAt: 1` / `flushInterval: 0` for immediate event delivery in serverless API routes.
- **`components/todos/todo-list.tsx`** (updated) — Added four client-side events on successful API responses and `captureException` in catch blocks.
- **`pages/api/todos/index.ts`** (updated) — Added server-side `todo_created` event after successful POST, with distinct ID correlation via `X-PostHog-Distinct-ID` header.
- **`pages/api/todos/[id].ts`** (updated) — Added server-side `todo_updated` and `todo_deleted` events after successful PATCH/DELETE, with distinct ID correlation.
- **`.env.local`** (new) — PostHog public token and host written as `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

| Event | Description | File |
|---|---|---|
| `todo_created` | User successfully created a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marked a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marked a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deleted a todo item (client-side) | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: new todo created via API | `pages/api/todos/index.ts` |
| `todo_updated` | Server-side: todo updated via API | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server-side: todo deleted via API | `pages/api/todos/[id].ts` |

## Next steps

To view your analytics, head to your PostHog project and create an "Analytics basics" dashboard with these suggested insights:

- **Todo creation trend** — trend of `todo_created` over time
- **Task completion rate** — ratio of `todo_completed` to `todo_created` (conversion funnel)
- **Todo lifecycle funnel** — funnel from `todo_created` → `todo_completed` → `todo_deleted`
- **Deletion without completion** — users who fire `todo_deleted` without a preceding `todo_completed` (churn signal)
- **Active users** — unique users performing any todo action per day/week

You can create this dashboard at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
