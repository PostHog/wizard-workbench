<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. The following changes were made:

- **`instrumentation-client.ts`** — Created to initialize PostHog client-side using the `/ingest` reverse proxy, with error tracking (`capture_exceptions: true`) and debug mode enabled in development.
- **`next.config.ts`** — Updated with `/ingest` rewrites to proxy PostHog requests through the Next.js server, preventing ad-blocker interference.
- **`lib/posthog-server.ts`** — Created a singleton PostHog server-side client (using `posthog-node`) for tracking events from API routes.
- **`.env.local`** — Populated with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.
- **`components/todos/todo-list.tsx`** — Added client-side `posthog.capture()` calls for todo CRUD events, `X-POSTHOG-DISTINCT-ID` / `X-POSTHOG-SESSION-ID` headers on API requests for session correlation, and `posthog.captureException()` in error handlers.
- **`pages/api/todos/index.ts`** — Added server-side `todo_created` event capture on POST success, reading the client's distinct ID and session ID from request headers.
- **`pages/api/todos/[id].ts`** — Added server-side `todo_updated` and `todo_deleted` event captures on PATCH/DELETE success, with the same session correlation.

| Event | Description | File |
|---|---|---|
| `todo_created` | Fired client-side when a new todo is successfully created | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired client-side when a todo is toggled to completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired client-side when a completed todo is toggled back to active | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired client-side when a todo is successfully deleted | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side event on POST /api/todos success | `pages/api/todos/index.ts` |
| `todo_updated` | Server-side event on PATCH /api/todos/[id] success | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server-side event on DELETE /api/todos/[id] success | `pages/api/todos/[id].ts` |

## Next steps

The PostHog API key used during setup was missing the required `dashboard:write`, `insight:write`, and `query:read` scopes, so the "Analytics basics" dashboard could not be created automatically. Once you have a key with the necessary permissions, you can create insights for:

- **Todo creation trend** — `todo_created` over time (trends)
- **Completion funnel** — `todo_created` → `todo_completed` (funnel)
- **Deletion rate** — `todo_deleted` relative to `todo_created` (trends formula)
- **Reopen rate** — `todo_reopened` relative to `todo_completed` (trends)
- **Active vs completed ratio** — breakdown of `todo_completed` vs `todo_reopened`

Visit [Insights](/insights) or [Dashboards](/dashboard) in your PostHog project to set these up manually.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
