<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 Pages Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the `instrumentation-client.ts` approach for Next.js 15.3+. Includes session replay, exception capture, and reverse proxy routing via `/ingest`.
- **`next.config.ts`** (updated): Added reverse proxy rewrites for PostHog ingestion (`/ingest/*` → PostHog servers), improving ad-blocker resilience. Added `skipTrailingSlashRedirect: true` for PostHog compatibility.
- **`lib/posthog-server.ts`** (new): Singleton PostHog Node.js client for server-side event capture in API routes.
- **`components/todos/todo-list.tsx`** (updated): Added `posthog.capture()` calls for all four todo actions, plus `posthog.captureException()` error tracking in catch blocks.
- **`.env.local`** (new): PostHog environment variables (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) added and `.gitignore`-protected.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired when a user marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |

## Next steps

We've prepared an "Analytics basics" dashboard for you to keep an eye on user behavior. Visit PostHog to create it with these insights:

- **[Todos Created Over Time](https://us.posthog.com/project/238460/insights/new#insight=TRENDS&events=[{"id":"todo_created","name":"todo_created","type":"events"}])** — Track how many todos are created per day
- **[Todo Completion Rate Funnel](https://us.posthog.com/project/238460/insights/new#insight=FUNNELS&events=[{"id":"todo_created","name":"todo_created","type":"events"},{"id":"todo_completed","name":"todo_completed","type":"events"}])** — Funnel from todo_created → todo_completed to see completion rate
- **[Todo Deletion Rate](https://us.posthog.com/project/238460/insights/new#insight=TRENDS&events=[{"id":"todo_deleted","name":"todo_deleted","type":"events"}])** — Track how often todos are deleted (churn signal)
- **[Active vs Completed Todos](https://us.posthog.com/project/238460/insights/new#insight=TRENDS&events=[{"id":"todo_completed","name":"todo_completed","type":"events"},{"id":"todo_reopened","name":"todo_reopened","type":"events"}])** — Compare completion vs. reopening activity
- **[Create a new dashboard →](https://us.posthog.com/project/238460/dashboard/new)**

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
