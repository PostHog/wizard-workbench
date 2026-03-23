<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes the PostHog JS SDK for client-side analytics using Next.js 15.3+ instrumentation. Enables automatic exception capture and a reverse proxy for reliable event delivery.
- **`next.config.ts`** (updated): Added PostHog reverse proxy rewrites (`/ingest/*` → PostHog ingest URL) and `skipTrailingSlashRedirect: true` to ensure correct event batching.
- **`lib/posthog-server.ts`** (new): Singleton PostHog Node.js client for server-side event tracking in API routes.
- **`components/todos/todo-list.tsx`** (updated): Added client-side PostHog event captures for `todo_created`, `todo_completed`, `todo_reopened`, and `todo_deleted` in each respective event handler. Also added `captureException` calls in error handlers.
- **`app/api/todos/route.ts`** (updated): Added server-side `todo_created` event capture after successful todo creation via the POST API route.
- **`app/api/todos/[id]/route.ts`** (updated): Added server-side `todo_updated` event capture on PATCH and `todo_deleted` event capture on DELETE.
- **`.env.local`** (updated): Set `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired when a user marks a completed todo item as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: Fired when a new todo is successfully persisted via the API | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: Fired when a todo is successfully updated via the API | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side: Fired when a todo is successfully deleted via the API | `app/api/todos/[id]/route.ts` |

## Next steps

Visit your PostHog project to explore the captured events and build insights:

- [PostHog Project Dashboard](https://us.posthog.com/project/238460/dashboard)
- [Create a new dashboard](https://us.posthog.com/project/238460/dashboard/new) named "Analytics basics" with insights such as:
  - **Todos Created Over Time**: Trend of `todo_created` events (daily, last 30 days)
  - **Todo Completion Funnel**: Funnel from `todo_created` → `todo_completed`
  - **Todo Deletion Rate**: Trend of `todo_deleted` events
  - **Todo Activity Overview**: Combined trends of `todo_created`, `todo_completed`, `todo_reopened`, `todo_deleted`
  - **Server vs Client Events**: Compare server-side `todo_created` (source: api) with client-side captures

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
