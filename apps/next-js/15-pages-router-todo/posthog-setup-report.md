# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 Pages Router todo application. The integration includes:

- **Client-side PostHog initialization** via `instrumentation-client.ts` for Next.js 15.3+
- **Server-side PostHog client** in `lib/posthog-server.ts` for API route tracking
- **Reverse proxy configuration** in `next.config.ts` to route analytics through `/ingest` to avoid ad blockers
- **Environment variables** configured in `.env` for PostHog API key and host
- **Exception tracking** enabled via `capture_exceptions: true` for automatic error capture
- **Event tracking** for all todo CRUD operations (create, complete, uncomplete, delete)
- **Server-side error tracking** for API failures with detailed error properties

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | User creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_create_failed` | Server-side: Failed to create a todo due to validation or server error | `pages/api/todos/index.ts` |
| `todo_update_failed` | Server-side: Failed to update a todo due to validation or server error | `pages/api/todos/[id].ts` |
| `todo_delete_failed` | Server-side: Failed to delete a todo due to server error | `pages/api/todos/[id].ts` |

## Next steps

### Recommended Dashboard Insights

Create a dashboard called "Analytics basics" in PostHog with the following insights:

1. **Todo Creation Trend** - Track `todo_created` events over time
2. **Task Completion Funnel** - Funnel from `todo_created` → `todo_completed`
3. **Todo Completion Rate** - Ratio of `todo_completed` to `todo_created` events
4. **Error Rate** - Combined count of `todo_create_failed`, `todo_update_failed`, and `todo_delete_failed`
5. **User Engagement** - Total unique users performing any todo action

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Files Modified/Created

- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client helper
- `next.config.ts` - Added reverse proxy rewrites
- `components/todos/todo-list.tsx` - Added client-side event tracking
- `pages/api/todos/index.ts` - Added server-side error tracking for creation
- `pages/api/todos/[id].ts` - Added server-side error tracking for update/delete
- `.env` - PostHog environment variables
