<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application.

**What was added:**

- `instrumentation-client.ts` — Initializes PostHog client-side using the Next.js 15.3+ instrumentation hook. Configured with a reverse proxy (`/ingest`), exception capture, and debug mode in development.
- `next.config.ts` — Added reverse proxy rewrites for `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*` routes to route PostHog traffic through the Next.js server. Also set `skipTrailingSlashRedirect: true`.
- `lib/posthog-server.ts` — Singleton server-side PostHog client using `posthog-node` for capturing events from API routes.
- `components/todos/todo-list.tsx` — Added four client-side capture calls covering the full todo lifecycle, plus `captureException` on all fetch error paths. Each mutating API call passes `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to correlate client and server events.
- `app/api/todos/route.ts` — Added `server_todo_created` event on successful POST, reading the distinct ID and session ID from request headers.
- `app/api/todos/[id]/route.ts` — Added `server_todo_updated` and `server_todo_deleted` events on successful PATCH and DELETE respectively.
- `.env.local` — Populated `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `todo_created` | User successfully added a new todo via the form | `components/todos/todo-list.tsx` |
| `todo_completed` | User checked a todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | User unchecked a completed todo, marking it active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deleted a todo (includes `was_completed` property) | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server confirmed new todo persisted via POST `/api/todos` | `app/api/todos/route.ts` |
| `server_todo_updated` | Server confirmed todo updated via PATCH `/api/todos/[id]` | `app/api/todos/[id]/route.ts` |
| `server_todo_deleted` | Server confirmed todo removed via DELETE `/api/todos/[id]` | `app/api/todos/[id]/route.ts` |

## Next steps

We were unable to auto-create the dashboard because the PostHog API key is missing the `dashboard:write` and `query:read` scopes. To add an **Analytics basics** dashboard manually, visit your [PostHog project dashboards](/dashboard) and create the following insights:

1. **Todo creation trend** — Trends chart for `todo_created` over time (daily)
2. **Todo completion rate** — Trends chart comparing `todo_completed` vs `todo_created` (to measure how many created todos get done)
3. **Todo deletion trend** — Trends chart for `todo_deleted` with breakdown by `was_completed` property (to see if users delete completed vs active todos)
4. **Create → Complete funnel** — Funnel insight with steps: `todo_created` → `todo_completed` (conversion rate of created todos that get completed)
5. **Todo activity overview** — Trends chart with all four user events (`todo_created`, `todo_completed`, `todo_reopened`, `todo_deleted`) as separate series

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
