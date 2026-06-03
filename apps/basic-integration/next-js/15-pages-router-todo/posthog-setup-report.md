<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the recommended `instrumentation-client.ts` approach for Next.js 15.3+. Configures a reverse proxy via `/ingest`, enables exception capture, and sets `debug` mode in development.
- **`next.config.ts`** (updated): Added reverse proxy rewrites routing `/ingest/*` and `/ingest/static/*` and `/ingest/array/*` to PostHog's ingestion servers, plus `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client (using `posthog-node`) for capturing events from API routes, with `flushAt: 1` and `flushInterval: 0` for immediate flushing.
- **`components/todos/todo-list.tsx`** (updated): Captures four client-side events (`todo_created`, `todo_completed`, `todo_uncompleted`, `todo_deleted`) after successful API calls. Also passes `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers with every API request to correlate client and server events. Error tracking via `posthog.captureException` added to catch blocks.
- **`pages/api/todos/index.ts`** (updated): Captures a server-side `todo_created` event on successful POST using the client's distinct ID from request headers.
- **`pages/api/todos/[id].ts`** (updated): Captures server-side `todo_updated` (PATCH) and `todo_deleted` (DELETE) events using the client's distinct ID from request headers.
- **`.env.local`** (updated): `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables set.

| Event | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User unchecks a completed todo | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server confirms todo creation via POST API | `pages/api/todos/index.ts` |
| `todo_updated` | Server confirms todo update via PATCH API | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server confirms todo deletion via DELETE API | `pages/api/todos/[id].ts` |

## Next steps

We attempted to create an "Analytics basics" dashboard automatically, but the PostHog API key is missing the required `dashboard:write`, `query:read`, and `insight:write` scopes. You can build the following recommended insights manually in PostHog:

1. **Todo creation trend** — Trends chart for `todo_created` over time to monitor user engagement.
2. **Todo completion funnel** — Funnel from `todo_created` → `todo_completed` to measure completion rate.
3. **Todo deletion trend** — Trends chart for `todo_deleted` to monitor churn/abandonment.
4. **Completions vs. Uncompletes** — Side-by-side trend of `todo_completed` vs `todo_uncompleted`.
5. **Net todo growth** — Formula trend: `A - B` where A = `todo_created`, B = `todo_deleted`.

Visit [PostHog Insights](/insights) to create these, then pin them to a new [Dashboard](/dashboard).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
