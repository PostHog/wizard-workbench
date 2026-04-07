<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new) — Initialises PostHog client-side via the Next.js 15.3+ instrumentation hook. Enables session replay, automatic pageview capture, and exception tracking via `capture_exceptions: true`. All PostHog traffic is proxied through `/ingest` to improve ad-blocker resilience.
- **`next.config.ts`** — Added reverse-proxy rewrites for `/ingest` → `https://us.i.posthog.com` and `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new) — Singleton PostHog Node.js client used in API routes for server-side event capture.
- **`components/todos/todo-list.tsx`** — Added `posthog.capture()` calls for four user-action events. Added `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to every API call so server-side events correlate with the same person. Added `posthog.captureException()` in all catch blocks.
- **`app/api/todos/route.ts`** — Server-side `todo_created` event captured on successful POST, using the distinct ID from the request header.
- **`app/api/todos/[id]/route.ts`** — Server-side `todo_updated` and `todo_deleted` events captured on successful PATCH and DELETE.
- **`.env.local`** — `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` written.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo (client) | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as done (client) | `components/todos/todo-list.tsx` |
| `todo_reopened` | User un-checks a completed todo (client) | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo (client) | `components/todos/todo-list.tsx` |
| `todo_created` | Server confirms new todo was persisted (server) | `app/api/todos/route.ts` |
| `todo_updated` | Server confirms todo was updated (server) | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server confirms todo was deleted (server) | `app/api/todos/[id]/route.ts` |

## Next steps

To monitor user behaviour, create an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Todo creation trend** — Trends chart for `todo_created` over time (daily/weekly). Measures how actively users are creating tasks.
2. **Todo completion rate** — Formula insight: `todo_completed / todo_created` over time. Your primary engagement and retention metric.
3. **Task completion funnel** — Funnel: `todo_created` → `todo_completed`. Shows the share of created todos that are eventually finished.
4. **Delete rate** — Trends chart for `todo_deleted` alongside `todo_created`. High deletes relative to creates may signal friction.
5. **Active users** — Unique users performing any todo action (`todo_created` OR `todo_completed`) per week.

Open your PostHog project to build these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
