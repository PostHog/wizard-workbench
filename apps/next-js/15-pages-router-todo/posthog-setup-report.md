<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 Pages Router todo application. Here is a summary of what was set up:

- **`posthog-js`** and **`posthog-node`** were installed as dependencies.
- **`instrumentation-client.ts`** was created at the project root to initialize PostHog client-side using the Next.js 15.3+ instrumentation pattern. This enables automatic pageview tracking, session replay, and error tracking via `capture_exceptions: true`.
- **`next.config.ts`** was updated to add reverse-proxy rewrites for PostHog ingestion, routing `/ingest/*` through your own domain to improve ad-blocker resilience.
- **`lib/posthog-server.ts`** was created as a singleton server-side PostHog client (using `posthog-node`) for tracking events in API routes.
- **`components/todos/todo-list.tsx`** was updated to capture client-side todo lifecycle events and pass the PostHog distinct ID to API routes via `x-posthog-distinct-id` header for client/server correlation.
- **`pages/api/todos/index.ts`** was updated to capture a server-side `server_todo_created` event on successful todo creation.
- **`pages/api/todos/[id].ts`** was updated to capture `server_todo_updated` and `server_todo_deleted` server-side events.
- **`.env.local`** was created/updated with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`.

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_create_failed` | Fired when an API error occurs while creating a todo | `components/todos/todo-list.tsx` |
| `todo_delete_failed` | Fired when an API error occurs while deleting a todo | `components/todos/todo-list.tsx` |
| `todo_toggle_failed` | Fired when an API error occurs while toggling a todo | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side: todo successfully created via POST /api/todos | `pages/api/todos/index.ts` |
| `server_todo_updated` | Server-side: todo successfully updated via PATCH /api/todos/[id] | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server-side: todo successfully deleted via DELETE /api/todos/[id] | `pages/api/todos/[id].ts` |

## Next steps

We've pre-configured the insights and dashboard links for you. Click the links below to create them directly in PostHog:

### Create "Analytics basics" dashboard
- [Create new dashboard](https://us.posthog.com/project/238460/dashboard/new)

### Suggested insights to add to your dashboard

1. **Todo Creation Trend** — Track how many todos users create over time:
   [Create Trend insight: todo_created](https://us.posthog.com/project/238460/insights/new#{"events":[{"id":"todo_created","type":"events","name":"todo_created"}],"insight":"TRENDS","display":"ActionsLineGraph"})

2. **Todo Completion Funnel** — Conversion from creating to completing a todo:
   [Create Funnel insight](https://us.posthog.com/project/238460/insights/new#{"events":[{"id":"todo_created","type":"events","name":"todo_created"},{"id":"todo_completed","type":"events","name":"todo_completed"}],"insight":"FUNNELS"})

3. **Todo Actions Breakdown** — Compare creates, completions, and deletions side by side:
   [Create Breakdown insight](https://us.posthog.com/project/238460/insights/new#{"events":[{"id":"todo_created","type":"events","name":"todo_created"},{"id":"todo_completed","type":"events","name":"todo_completed"},{"id":"todo_deleted","type":"events","name":"todo_deleted"}],"insight":"TRENDS","display":"ActionsBar"})

4. **Todo Error Rate** — Monitor API errors affecting todo operations:
   [Create Error Rate insight](https://us.posthog.com/project/238460/insights/new#{"events":[{"id":"todo_create_failed","type":"events","name":"todo_create_failed"},{"id":"todo_delete_failed","type":"events","name":"todo_delete_failed"},{"id":"todo_toggle_failed","type":"events","name":"todo_toggle_failed"}],"insight":"TRENDS","display":"ActionsLineGraph"})

5. **Server-side Todo Activity** — Track server-confirmed todo operations:
   [Create Server Activity insight](https://us.posthog.com/project/238460/insights/new#{"events":[{"id":"server_todo_created","type":"events","name":"server_todo_created"},{"id":"server_todo_updated","type":"events","name":"server_todo_updated"},{"id":"server_todo_deleted","type":"events","name":"server_todo_deleted"}],"insight":"TRENDS","display":"ActionsBar"})

You can also view your [PostHog project dashboard list](https://us.posthog.com/project/238460/dashboards) to create and manage dashboards.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
