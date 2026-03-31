<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. Here's a summary of all changes made:

- **`instrumentation-client.ts`** (new): Client-side PostHog initialization using the `instrumentation-client` pattern for Next.js 15.3+. Enables automatic session recording, error tracking (`capture_exceptions: true`), and routes events through a reverse proxy (`/ingest`).
- **`next.config.ts`**: Added reverse proxy rewrites for `/ingest/*` to route PostHog traffic through the app, reducing the risk of ad-blocker interference. Also set `skipTrailingSlashRedirect: true` as required by PostHog.
- **`lib/posthog-server.ts`** (new): Singleton PostHog Node.js client for server-side event capture. Uses `flushAt: 1` and `flushInterval: 0` for immediate event flushing in short-lived Next.js API routes.
- **`components/todos/todo-list.tsx`**: Added client-side event capture for all core todo user actions, plus exception tracking on errors.
- **`app/api/todos/route.ts`**: Added server-side event capture for todo creation via the POST API route.
- **`app/api/todos/[id]/route.ts`**: Added server-side event capture for todo updates and deletions via the PATCH and DELETE API routes.
- **`.env.local`**: Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User successfully creates a new todo item via the form | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed via the checkbox | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo item as incomplete via the checkbox | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item via the delete button | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: A new todo is created via the POST API route | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: A todo is updated via the PATCH API route | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side: A todo is deleted via the DELETE API route | `app/api/todos/[id]/route.ts` |

## Next steps

To explore your analytics, head to your PostHog project and create an **"Analytics basics"** dashboard with insights like:

- **Todo creation trend** — Track `todo_created` over time to see how often users add tasks.
- **Completion funnel** — Funnel from `todo_created` → `todo_completed` to measure completion rate.
- **Churn signal** — Track `todo_deleted` frequency to identify potential user frustration.
- **Active vs completed ratio** — Compare `todo_completed` vs `todo_uncompleted` events over time.
- **Error rate** — Monitor exception captures from `$exception` events around todo actions.

You can access your PostHog project here: [PostHog Dashboard](https://us.posthog.com/project/238460)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
