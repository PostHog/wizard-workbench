<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router Todo application.

**Summary of changes:**

- **`instrumentation-client.ts`** (new) — Initializes PostHog client-side using the Next.js 15.3+ `instrumentation-client` pattern. Configured with a reverse proxy (`/ingest`), error tracking (`capture_exceptions: true`), and debug mode in development.
- **`next.config.ts`** — Added reverse proxy rewrites routing `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*` to PostHog's US servers, plus `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new) — Singleton server-side PostHog Node.js client using `posthog-node`, configured with `flushAt: 1` and `flushInterval: 0` for immediate flushing in short-lived API routes.
- **`components/todos/todo-list.tsx`** — Added four client-side `posthog.capture()` calls in event handlers (not `useEffect`), plus `posthog.captureException()` in all catch blocks.
- **`pages/api/todos/index.ts`** — Added server-side `todo_created` capture on successful POST, reading `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers for client/server identity correlation.
- **`pages/api/todos/[id].ts`** — Added server-side captures for `todo_completed`, `todo_uncompleted`, and `todo_deleted` on successful PATCH/DELETE, with the same header-based identity correlation.
- **`.env.local`** — Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx`, `pages/api/todos/index.ts` |
| `todo_completed` | Fired when a user marks a todo item as completed | `components/todos/todo-list.tsx`, `pages/api/todos/[id].ts` |
| `todo_uncompleted` | Fired when a user marks a completed todo item as incomplete | `components/todos/todo-list.tsx`, `pages/api/todos/[id].ts` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx`, `pages/api/todos/[id].ts` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these five recommended insights:

1. **Todo creation trend** — Trends insight on `todo_created` over time. Answers: how many todos are users creating per day/week?
   - [Create insight →](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"todo_created","name":"todo_created","type":"events"}])

2. **Todo completion funnel** — Funnel from `todo_created` → `todo_completed`. Answers: what % of created todos are completed?
   - [Create insight →](https://us.posthog.com/project/2/insights/new#insight=FUNNELS&events=[{"id":"todo_created"},{"id":"todo_completed"}])

3. **Todo deletion rate** — Trends insight comparing `todo_deleted` vs `todo_created`. Answers: what % of todos are deleted rather than completed?
   - [Create insight →](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"todo_deleted","name":"todo_deleted","type":"events"},{"id":"todo_created","name":"todo_created","type":"events"}])

4. **Todo completion vs deletion** — Funnel from `todo_created` → `todo_completed` with `todo_deleted` as a second branch. Answers: do users complete or delete their todos?
   - [Create insight →](https://us.posthog.com/project/2/insights/new#insight=FUNNELS&events=[{"id":"todo_created"},{"id":"todo_completed"}])

5. **Daily active todo users** — Unique users capturing any todo event (`todo_created` OR `todo_completed` OR `todo_deleted`). Answers: daily active users engaging with the todo app.
   - [Create insight →](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"todo_created","math":"dau"},{"id":"todo_completed","math":"dau"},{"id":"todo_deleted","math":"dau"}])

[Create "Analytics basics" dashboard →](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
