<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router Todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Client-side PostHog initialization using `posthog.init()` with reverse proxy support, exception capture, and debug mode in development.
- **`next.config.ts`** (modified): Added PostHog reverse proxy rewrites (`/ingest/*` → `https://us.i.posthog.com/*`) and `skipTrailingSlashRedirect: true` to ensure reliable event delivery and reduce tracking blocker interference.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node`, configured with `flushAt: 1` and `flushInterval: 0` for immediate event flushing in serverless environments.
- **`components/todos/todo-list.tsx`** (modified): Added four client-side capture events across all todo mutation handlers. Also added `posthog.captureException()` calls in each catch block for error tracking.
- **`.env.local`** (new/updated): `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` set via the wizard-tools MCP (values never written to source code).

| Event name | Description | File |
|---|---|---|
| `todo_created` | User creates a new todo item with a title and optional description | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo item as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |

## Next steps

To explore your analytics, visit your PostHog project and create an **"Analytics basics"** dashboard with insights such as:

- **Todo creation trend** — `todo_created` event count over time
- **Completion rate funnel** — `todo_created` → `todo_completed` funnel
- **Deletion rate** — `todo_deleted` count vs `todo_created` to measure churn
- **Task engagement** — Unique users triggering `todo_completed` or `todo_uncompleted`
- **Error rate** — Captured exceptions from `posthog.captureException()` calls

You can build these at: https://us.posthog.com/project/2/insights

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
