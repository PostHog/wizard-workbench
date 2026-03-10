<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new): Initializes `posthog-js` for client-side analytics using the `instrumentation-client` pattern supported in Next.js 15.3+. Configured with a reverse proxy path (`/ingest`), error tracking (`capture_exceptions: true`), and debug mode in development.
- **`next.config.ts`** (updated): Added reverse proxy rewrites for PostHog ingestion (`/ingest/*` → `https://us.i.posthog.com/*`) and set `skipTrailingSlashRedirect: true` as required by PostHog.
- **`lib/posthog-server.ts`** (new): Server-side PostHog client singleton using `posthog-node`. Configured with `flushAt: 1` and `flushInterval: 0` to ensure events are sent immediately from short-lived serverless functions.
- **`components/todos/todo-list.tsx`** (updated): Added client-side `posthog.capture()` calls in each todo action handler. Also added `posthog.captureException()` in catch blocks for error tracking.
- **`app/api/todos/route.ts`** (updated): Added server-side `posthog.capture()` on successful todo creation via the API.
- **`app/api/todos/[id]/route.ts`** (updated): Added server-side `posthog.capture()` on successful todo update and delete via the API.
- **`.env.local`** (new): Created with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` set. Covered by `.gitignore`.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired when a user marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created_api` | Server-side event fired when a todo is successfully created via the API | `app/api/todos/route.ts` |
| `todo_updated_api` | Server-side event fired when a todo is successfully updated via the API | `app/api/todos/[id]/route.ts` |
| `todo_deleted_api` | Server-side event fired when a todo is successfully deleted via the API | `app/api/todos/[id]/route.ts` |

## Next steps

To visualize these events, create an **"Analytics basics"** dashboard in PostHog with these suggested insights:

1. **Todo creation trend** — Trends chart for `todo_created` over time to see growth in user engagement.
2. **Todo completion funnel** — Funnel from `todo_created` → `todo_completed` to measure task completion rate.
3. **Todo deletion rate** — Trends chart for `todo_deleted` vs `todo_created` to identify churn signals (users deleting more than creating).
4. **Active users** — Unique users per day based on `todo_created` events.
5. **Server vs client event volume** — Compare `todo_created` (client) vs `todo_created_api` (server) to verify end-to-end tracking health.

You can create this dashboard at: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
