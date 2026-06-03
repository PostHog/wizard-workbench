<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 15 Pages Router todo application with PostHog analytics. Here's a summary of all changes made:

- **`instrumentation-client.ts`** (new) — Initializes PostHog client-side using the Next.js instrumentation hook. Enables session replay, error tracking, and debug mode in development.
- **`next.config.ts`** (updated) — Added reverse proxy rewrites for `/ingest/*` to route PostHog requests through your own domain, reducing tracking-blocker interference.
- **`lib/posthog-server.ts`** (new) — Singleton server-side PostHog client using `posthog-node`, used in API routes to capture server-side events correlated with client sessions.
- **`.env.local`** (updated) — Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.
- **`components/todos/todo-list.tsx`** (updated) — Added client-side `posthog.capture()` calls for all four key todo events, plus exception capture on errors. Passes `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to API routes for client/server correlation.
- **`pages/api/todos/index.ts`** (updated) — Added server-side `todo_created` event capture using the distinct ID passed from the client.
- **`pages/api/todos/[id].ts`** (updated) — Added server-side `todo_completed`, `todo_uncompleted`, and `todo_deleted` event capture using the distinct ID passed from the client.

| Event | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx`, `pages/api/todos/index.ts` |
| `todo_completed` | User marks a todo as completed | `components/todos/todo-list.tsx`, `pages/api/todos/[id].ts` |
| `todo_uncompleted` | User unchecks a completed todo, marking it active again | `components/todos/todo-list.tsx`, `pages/api/todos/[id].ts` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx`, `pages/api/todos/[id].ts` |

## Next steps

To explore your analytics, create an "Analytics basics" dashboard in PostHog with these suggested insights:

- **Todo creation trend** — `query-trends` on `todo_created` over time
- **Completion rate** — `query-trends` comparing `todo_completed` vs `todo_created` (formula `A/B*100`)
- **Todo deletion trend** — `query-trends` on `todo_deleted` over time
- **Completion funnel** — `query-funnel` with steps: `todo_created` → `todo_completed`
- **Task activity breakdown** — `query-trends` showing all four events stacked

Visit your [PostHog project dashboards](/dashboard) to create these insights.

> **Note:** Dashboard creation via the PostHog MCP was not possible because the API key is missing the `dashboard:write`, `insight:write`, and `query:read` scopes. You can create the dashboard manually at the link above, or re-authenticate the MCP connector with the required scopes.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
