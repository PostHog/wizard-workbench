<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new) — Initializes PostHog on the client side using Next.js 15.3+ instrumentation support. Configures the reverse proxy ingestion endpoint, exception capture, and debug mode in development.
- **`next.config.ts`** (edited) — Added reverse proxy rewrites so PostHog events are sent through `/ingest` on the same domain, improving ad-blocker resistance and data accuracy. Also set `skipTrailingSlashRedirect: true` as required by PostHog.
- **`lib/posthog-server.ts`** (new) — Singleton server-side PostHog client using `posthog-node`, configured with `flushAt: 1` and `flushInterval: 0` for immediate event flushing in serverless/API route contexts.
- **`components/todos/todo-list.tsx`** (edited) — Added client-side event tracking for all key user actions, plus `captureException` in every catch block for error tracking.
- **`pages/api/todos/index.ts`** (edited) — Added server-side `todo_created` event via `posthog-node`, reading the `x-posthog-distinct-id` header to correlate with the client-side user identity.
- **`pages/api/todos/[id].ts`** (edited) — Added server-side `todo_deleted` event via `posthog-node`, reading the `x-posthog-distinct-id` header for user correlation.
- **`.env.local`** (created) — Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user unchecks a todo (marks it not completed) | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side event fired when a todo is created via API | `pages/api/todos/index.ts` |
| `todo_deleted` | Server-side event fired when a todo is deleted via API | `pages/api/todos/[id].ts` |

## Next steps

Start your dev server and interact with todos — events will begin appearing in your PostHog project at:

- **Live events**: https://us.posthog.com/project/2/activity/explore
- **Create a dashboard**: https://us.posthog.com/project/2/dashboard

Suggested insights to build in PostHog:

1. **Todo creation trend** — Trends chart for `todo_created` over time
2. **Completion rate** — Formula: `todo_completed / todo_created` to measure how many created todos get completed
3. **Deletion rate** — Trends chart for `todo_deleted` to track churn/abandonment
4. **Todo lifecycle funnel** — Funnel: `todo_created` → `todo_completed` to see how many todos users follow through on
5. **Active users** — Unique users performing any todo action per day/week

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
