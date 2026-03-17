<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 App Router todo application.

## Summary of changes

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using `posthog-js` via the Next.js 15.3+ instrumentation approach. Configured with a reverse-proxy ingestion path, exception capture, and debug mode in development.
- **`next.config.ts`** (updated): Added rewrites to proxy PostHog ingestion requests through `/ingest`, improving ad-blocker resilience and data accuracy.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node` for API route event tracking.
- **`.env.local`** (updated): PostHog project token and host stored as environment variables.
- **`components/todos/todo-list.tsx`** (updated): Client-side event capture added to all todo CRUD handlers with exception tracking on errors.
- **`app/api/todos/route.ts`** (updated): Server-side capture of `todo_created_api` on successful POST.
- **`app/api/todos/[id]/route.ts`** (updated): Server-side capture of `todo_updated_api` and `todo_deleted_api` on successful PATCH and DELETE.

## Events tracked

| Event | Description | File |
|---|---|---|
| `todo_created` | User creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | User marks a completed todo as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created_api` | Server-side: todo successfully created via POST /api/todos | `app/api/todos/route.ts` |
| `todo_updated_api` | Server-side: todo successfully updated via PATCH /api/todos/[id] | `app/api/todos/[id]/route.ts` |
| `todo_deleted_api` | Server-side: todo successfully deleted via DELETE /api/todos/[id] | `app/api/todos/[id]/route.ts` |

## Next steps

Build insights and a dashboard in PostHog to monitor user behavior with the events above. Here are some recommended insights to create:

- **[Todo creations over time](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=[{"id":"todo_created"}])** — Trend of `todo_created` events
- **[Todo completion funnel](https://us.posthog.com/project/2/insights/new?insight=FUNNELS&events=[{"id":"todo_created"},{"id":"todo_completed"}])** — Conversion from creation to completion
- **[Todo deletion rate](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=[{"id":"todo_deleted"}])** — Trend of `todo_deleted` events (churn signal)
- **[Active vs completed tasks ratio](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=[{"id":"todo_completed"},{"id":"todo_reopened"}])** — Completed vs reopened trend
- **[Server API activity](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=[{"id":"todo_created_api"},{"id":"todo_updated_api"},{"id":"todo_deleted_api"}])** — All server-side API operations

Create an **"Analytics basics"** dashboard at [https://us.posthog.com/project/2/dashboard/new](https://us.posthog.com/project/2/dashboard/new) and add these insights to it.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
