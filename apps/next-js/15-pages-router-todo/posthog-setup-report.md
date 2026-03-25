<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Next.js 15 Pages Router Todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side via the Next.js instrumentation hook. Configured with a reverse proxy (`/ingest`), exception capture enabled, and debug mode in development.
- **`next.config.ts`** (updated): Added reverse proxy rewrites for `/ingest` → PostHog, plus `skipTrailingSlashRedirect: true` to support PostHog API requests.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node`, configured with `flushAt: 1` and `flushInterval: 0` for immediate event flushing in serverless API routes.
- **`components/todos/todo-list.tsx`** (updated): Added client-side event captures for todo CRUD actions plus `captureException` for error tracking in all catch blocks.
- **`pages/api/todos/index.ts`** (updated): Added server-side `todo_created` event via `posthog-node`, reading `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers for user correlation.
- **`pages/api/todos/[id].ts`** (updated): Added server-side `todo_updated` and `todo_deleted` events via `posthog-node` with the same header-based user correlation.
- **`.env.local`** (created): Contains `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired when a user marks a completed todo item as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: fired when a todo is successfully created via the API | `pages/api/todos/index.ts` |
| `todo_updated` | Server-side: fired when a todo is successfully updated via the API | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server-side: fired when a todo is successfully deleted via the API | `pages/api/todos/[id].ts` |

## Next steps

We've suggested some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented. You can create them in PostHog using the links below:

- [Create "Analytics basics" dashboard](https://us.posthog.com/project/238460/dashboard/new) — suggested insights to add:
  1. **Todo Creation Volume** — Trend of `todo_created` events over time to track engagement
  2. **Todo Completion Rate** — Funnel from `todo_created` → `todo_completed` to measure productivity
  3. **Todo Deletion Rate** — Trend of `todo_deleted` to monitor churn/abandonment
  4. **Active vs Completed Todos** — Compare `todo_completed` vs `todo_reopened` to understand task management patterns
  5. **Todo Lifecycle Funnel** — Full funnel: `todo_created` → `todo_completed` → `todo_deleted` for conversion analysis

- [PostHog Project Dashboard](https://us.posthog.com/project/238460/dashboard)
- [Insights Explorer](https://us.posthog.com/project/238460/insights)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
