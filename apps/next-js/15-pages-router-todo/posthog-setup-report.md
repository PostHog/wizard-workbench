<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the `posthog-js` library. Uses `instrumentation-client.ts` — the recommended approach for Next.js 15.3+. PostHog is routed through a reverse proxy (`/ingest`) for improved ad-blocker resilience. Exception capture is enabled for automatic error tracking.
- **`next.config.ts`** (updated): Added reverse proxy rewrites routing `/ingest/*` to PostHog's ingestion endpoints, plus `skipTrailingSlashRedirect: true` for compatibility.
- **`components/todos/todo-list.tsx`** (updated): Added `posthog.capture()` calls in all key user action handlers, plus `posthog.captureException()` for error tracking in catch blocks.
- **`.env.local`** (new): Created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired when a user unchecks a completed todo (marks it as active again) | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |

## Next steps

Visit your PostHog project to build an **"Analytics basics"** dashboard with these recommended insights:

1. **Todo creation trend** — Track `todo_created` event count over time to monitor user engagement
2. **Task completion funnel** — Funnel from `todo_created` → `todo_completed` to measure completion rate
3. **Todo completion rate** — `todo_completed` vs `todo_created` ratio as a key productivity metric
4. **Todo deletion rate** — Track `todo_deleted` events to understand abandonment patterns
5. **Reopen rate** — Track `todo_reopened` to understand how often users revisit completed tasks

- [PostHog project](https://us.posthog.com/project/2)
- [Create a new dashboard](https://us.posthog.com/project/2/dashboard)
- [View events](https://us.posthog.com/project/2/events)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
