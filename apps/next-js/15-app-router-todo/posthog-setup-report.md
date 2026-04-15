<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 15 App Router todo application with PostHog. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes the PostHog client-side SDK (`posthog-js`) via the Next.js instrumentation API. Configured with a reverse proxy (`/ingest`), exception capture enabled, and debug mode in development.
- **`next.config.ts`** (updated): Added reverse proxy rewrites routing `/ingest/*` to PostHog's US ingestion endpoint, and set `skipTrailingSlashRedirect: true` for PostHog compatibility.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client (`posthog-node`) with `flushAt: 1` and `flushInterval: 0` for immediate event flushing in short-lived serverless functions.
- **`components/todos/todo-list.tsx`** (updated): Added client-side event capture for all core todo actions and exception tracking on fetch errors.
- **`app/api/todos/route.ts`** (updated): Added server-side `todo_created` event on successful POST, using `X-PostHog-Distinct-ID` and `X-PostHog-Session-ID` headers for client/server identity correlation.
- **`app/api/todos/[id]/route.ts`** (updated): Added server-side `todo_updated` event on PATCH and `todo_deleted` event on DELETE, with the same identity correlation headers.
- **`.env.local`** (updated): Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User successfully creates a new todo item (client-side) | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | User marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item (client-side) | `components/todos/todo-list.tsx` |
| `todo_created` | New todo created via API (server-side) | `app/api/todos/route.ts` |
| `todo_updated` | Todo updated via API (server-side) | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Todo deleted via API (server-side) | `app/api/todos/[id]/route.ts` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in your PostHog project with these suggested insights:

1. **Todo creation trend** — Trend of `todo_created` events over time. Tracks how often users add new tasks.
2. **Todo completion rate** — Ratio of `todo_completed` to `todo_created` events. A core engagement metric.
3. **Todo deletion trend** — Trend of `todo_deleted` events over time. High deletion may signal churn or frustration.
4. **Completion funnel** — Funnel: `todo_created` → `todo_completed`. Measures what percentage of created todos get completed.
5. **Reopen rate** — Trend of `todo_reopened` events. Indicates users changing their mind on completions.

You can build these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
