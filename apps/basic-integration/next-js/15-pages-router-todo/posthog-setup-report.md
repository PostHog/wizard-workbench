<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application.

## Summary of changes

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side via `posthog-js` using `instrumentation-client.ts` (Next.js 15.3+ approach). Configured with a reverse proxy, exception capture, and debug mode in development.
- **`next.config.ts`**: Added reverse-proxy rewrites (`/ingest/*`) so PostHog requests route through your own domain, improving ad-blocker resilience and data quality. Added `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node` for capturing events from API routes.
- **`components/todos/todo-list.tsx`**: Added `posthog.capture()` calls on successful todo creation, completion, uncompletion, and deletion.
- **`pages/api/todos/index.ts`**: Added server-side `posthog.capture()` for `todo_created` on POST, with `x-posthog-distinct-id` and `x-posthog-session-id` header support for client-server correlation.
- **`pages/api/todos/[id].ts`**: Added server-side `posthog.capture()` for `todo_completed`, `todo_uncompleted` (on PATCH), and `todo_deleted` (on DELETE).
- **`.env.local`**: Created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx`, `pages/api/todos/index.ts` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx`, `pages/api/todos/[id].ts` |
| `todo_uncompleted` | User marks a completed todo item as incomplete | `components/todos/todo-list.tsx`, `pages/api/todos/[id].ts` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx`, `pages/api/todos/[id].ts` |

## Next steps

Build an "Analytics basics" dashboard in PostHog to monitor user behavior from these events. Here are five recommended insights:

1. **Todo creation trend** — Trend chart for `todo_created` over the last 30 days. Shows overall app usage and growth.
   [Create insight →](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo_created","type":"events"}],"date_from":"-30d"})

2. **Todo completion rate** — Funnel from `todo_created` → `todo_completed`. Reveals how many created todos actually get done.
   [Create insight →](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"todo_created","type":"events","order":0},{"id":"todo_completed","type":"events","order":1}],"date_from":"-30d"})

3. **Todo deletion rate** — Trend chart comparing `todo_created` vs `todo_deleted`. Indicates churn of tasks.
   [Create insight →](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo_created","type":"events"},{"id":"todo_deleted","type":"events"}],"date_from":"-30d"})

4. **Active users** — Unique users performing `todo_created` per day (DAU). Core engagement metric.
   [Create insight →](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo_created","type":"events","math":"dau"}],"date_from":"-30d"})

5. **Completion vs uncompletion** — Compare `todo_completed` vs `todo_uncompleted` over time. Shows task re-opening behavior.
   [Create insight →](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo_completed","type":"events"},{"id":"todo_uncompleted","type":"events"}],"date_from":"-30d"})

[Create "Analytics basics" dashboard →](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
