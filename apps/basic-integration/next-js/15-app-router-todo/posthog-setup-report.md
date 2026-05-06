<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router todo application. Here's a summary of all changes made:

**Client-side initialization** — `instrumentation-client.ts` was created at the project root. This file initializes `posthog-js` using Next.js 15.3+'s native `instrumentation-client` hook, which is the recommended approach for app router projects. It configures a reverse proxy via `/ingest`, enables automatic exception capture, and enables debug mode in development.

**Server-side client** — `lib/posthog-server.ts` was created to export a `getPostHogClient()` factory function that instantiates `posthog-node` per request with `flushAt: 1` and `flushInterval: 0` for reliable event delivery in short-lived serverless functions.

**Reverse proxy** — `next.config.ts` was updated with rewrites routing `/ingest/*` and `/ingest/array/*` to PostHog's US ingestion and asset CDN endpoints, reducing the likelihood of events being blocked by ad blockers.

**Client-side event tracking** — `components/todos/todo-list.tsx` was updated to capture four events on successful API responses: `todo_created`, `todo_completed`, `todo_uncompleted`, and `todo_deleted`. Exception capture was added to all error handlers.

**Server-side event tracking** — `app/api/todos/route.ts` and `app/api/todos/[id]/route.ts` were updated to capture `todo_created`, `todo_updated`, and `todo_deleted` server-side events. Server routes read the `x-posthog-distinct-id` request header to correlate server events with the client-side user identity.

**Environment variables** — `.env.local` was created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

---

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo back to active | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server confirms new todo creation via POST /api/todos | `app/api/todos/route.ts` |
| `todo_updated` | Server confirms todo update via PATCH /api/todos/[id] | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server confirms todo deletion via DELETE /api/todos/[id] | `app/api/todos/[id]/route.ts` |

---

## Next steps

Head to PostHog and create an **"Analytics basics"** dashboard. Here are five pre-configured insight links to add to it:

1. **[Todo Created Trend](https://us.posthog.com/project/2/insights/new#insight=TRENDS&interval=day&date_from=-30d&events=%5B%7B%22id%22%3A+%22todo_created%22%2C+%22type%22%3A+%22events%22%2C+%22name%22%3A+%22Todo+created%22%7D%5D)** — Daily volume of new todos created over the last 30 days.

2. **[Todo Completed Trend](https://us.posthog.com/project/2/insights/new#insight=TRENDS&interval=day&date_from=-30d&events=%5B%7B%22id%22%3A+%22todo_completed%22%2C+%22type%22%3A+%22events%22%2C+%22name%22%3A+%22Todo+completed%22%7D%5D)** — Daily volume of todos marked as completed — a key engagement signal.

3. **[Todo Deleted Trend](https://us.posthog.com/project/2/insights/new#insight=TRENDS&interval=day&date_from=-30d&events=%5B%7B%22id%22%3A+%22todo_deleted%22%2C+%22type%22%3A+%22events%22%2C+%22name%22%3A+%22Todo+deleted%22%7D%5D)** — Daily deletions; spikes may indicate users abandoning tasks or clearing clutter.

4. **[Todo Completion Funnel](https://us.posthog.com/project/2/insights/new#insight=FUNNELS&date_from=-30d&events=%5B%7B%22id%22%3A+%22todo_created%22%2C+%22type%22%3A+%22events%22%2C+%22name%22%3A+%22Todo+created%22%2C+%22order%22%3A+0%7D%2C+%7B%22id%22%3A+%22todo_completed%22%2C+%22type%22%3A+%22events%22%2C+%22name%22%3A+%22Todo+completed%22%2C+%22order%22%3A+1%7D%5D)** — Funnel from creation to completion; shows what fraction of created todos get finished.

5. **[All Todo Activity](https://us.posthog.com/project/2/insights/new#insight=TRENDS&interval=day&date_from=-30d&events=%5B%7B%22id%22%3A+%22todo_created%22%2C+%22type%22%3A+%22events%22%2C+%22name%22%3A+%22Created%22%7D%2C+%7B%22id%22%3A+%22todo_completed%22%2C+%22type%22%3A+%22events%22%2C+%22name%22%3A+%22Completed%22%7D%2C+%7B%22id%22%3A+%22todo_deleted%22%2C+%22type%22%3A+%22events%22%2C+%22name%22%3A+%22Deleted%22%7D%5D)** — All three event types overlaid on one chart for a complete activity overview.

To create the dashboard: go to [PostHog Dashboards](https://us.posthog.com/project/2/dashboard), click **New dashboard**, name it **"Analytics basics"**, then open each insight link above, save it, and add it to the dashboard.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
