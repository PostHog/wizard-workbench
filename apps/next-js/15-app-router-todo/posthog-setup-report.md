<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Next.js 15 App Router Todo application. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the `instrumentation-client` approach for Next.js 15.3+. Configures a reverse proxy (`/ingest`), enables exception capture for error tracking, and enables debug mode in development.
- **`next.config.ts`**: Added PostHog reverse proxy rewrites (`/ingest/static/:path*` and `/ingest/:path*`) and `skipTrailingSlashRedirect: true` to support PostHog trailing slash requests.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog Node.js client (`posthog-node`) used by API routes. Configured with `flushAt: 1` and `flushInterval: 0` for immediate event flushing in serverless environments.
- **`components/todos/todo-list.tsx`**: Added client-side event capture for all core todo actions in their respective event handlers. Added `posthog.captureException()` calls in error catch blocks.
- **`app/api/todos/route.ts`**: Added server-side `todo_created` event capture after successful todo creation via the API.
- **`app/api/todos/[id]/route.ts`**: Added server-side `todo_updated` and `todo_deleted` event captures for PATCH and DELETE operations respectively.
- **`.env.local`**: Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.
- **`package.json`**: Added `posthog-js` and `posthog-node` dependencies.

## Events

| Event Name | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo item (client-side) | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | User marks a completed todo item as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item (client-side) | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: New todo successfully created via API | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: Todo updated (completion status or content) via API | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side: Todo deleted via API | `app/api/todos/[id]/route.ts` |

## Next steps

We've suggested insights you can add to an "Analytics basics" dashboard to track todo app user behavior:

- **Todo Creations Over Time** — Trend of `todo_created` events to measure user productivity and growth
- **Todo Completion Funnel** — Funnel from `todo_created` → `todo_completed` to measure task completion rates
- **Deletion Rate** — Trend of `todo_deleted` events vs `todo_created` to identify if users are abandoning tasks
- **Todo Completion vs Reopening** — Compare `todo_completed` vs `todo_reopened` events to understand workflow patterns
- **Active Users Performing Todo Actions** — Unique users triggering any of `todo_created`, `todo_completed`, `todo_deleted`

You can create these insights in your PostHog project at: https://us.posthog.com/project/2/insights

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
