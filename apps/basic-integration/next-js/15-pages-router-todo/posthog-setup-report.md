<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes posthog-js using the Next.js 15.3+ client instrumentation file. Uses a reverse proxy (`/ingest`) for better ad-blocker resilience, enables exception capture for error tracking, and enables debug mode in development.
- **`next.config.ts`** (updated): Added reverse proxy rewrites for `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*` to route PostHog traffic through the Next.js server.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node`, configured with `flushAt: 1` and `flushInterval: 0` for reliable event delivery in short-lived API handlers.
- **`components/todos/todo-list.tsx`** (updated): Added four client-side `posthog.capture()` calls for the core todo lifecycle actions. Each fetch call to the API also passes `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers so server-side events can be correlated to the same user session.
- **`pages/api/todos/index.ts`** (updated): Added server-side `todo_created` event capture on successful POST.
- **`pages/api/todos/[id].ts`** (updated): Added server-side `todo_updated` and `todo_deleted` event capture on successful PATCH and DELETE respectively.
- **`.env.local`** (new): Created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | User marks a completed todo as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: a new todo is persisted via the API | `pages/api/todos/index.ts` |
| `todo_updated` | Server-side: a todo's fields are changed via the API | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server-side: a todo is removed via the API | `pages/api/todos/[id].ts` |

## Next steps

The MCP API key is missing `dashboard:write` and `query:read` scopes, so the "Analytics basics" dashboard could not be created automatically. To set it up manually in PostHog:

1. Go to [Dashboards](/dashboard) and create a new dashboard named **"Analytics basics"**.
2. Add the following insights:
   - **Todo creation trend** — Trends chart for `todo_created` over time.
   - **Todo completion rate** — Trends chart comparing `todo_completed` vs `todo_created` (formula: `A/B*100`).
   - **Todo deletion trend** — Trends chart for `todo_deleted` over time, broken down by `was_completed` to see if users delete finished vs unfinished todos.
   - **Todo lifecycle funnel** — Funnel insight with steps: `todo_created` → `todo_completed` → `todo_deleted` (showing how far users get in the todo lifecycle).
   - **Todo reopened events** — Trends chart for `todo_reopened` to track how often users undo completions.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
