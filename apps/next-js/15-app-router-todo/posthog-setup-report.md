# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 App Router todo application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+)
- **Server-side PostHog client** for API route event tracking
- **Reverse proxy configuration** to route PostHog requests through your domain (avoiding ad blockers)
- **Comprehensive event tracking** for all CRUD operations on todos

## Event Tracking Summary

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `todo_created` | User successfully created a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marked a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marked a completed todo as not completed | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deleted a todo item | `components/todos/todo-list.tsx` |
| `todo_create_failed` | Failed to create a new todo (client-side error) | `components/todos/todo-list.tsx` |
| `api_todo_created` | Server-side: Todo was successfully created via API | `app/api/todos/route.ts` |
| `api_todo_create_error` | Server-side: Error occurred while creating a todo | `app/api/todos/route.ts` |
| `api_todo_updated` | Server-side: Todo was successfully updated via API | `app/api/todos/[id]/route.ts` |
| `api_todo_deleted` | Server-side: Todo was successfully deleted via API | `app/api/todos/[id]/route.ts` |
| `api_todo_not_found` | Server-side: Requested todo was not found | `app/api/todos/[id]/route.ts` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - PostHog client-side initialization
- `lib/posthog-server.ts` - Server-side PostHog client for API routes
- `.env.local` - Environment variables for PostHog configuration

### Modified Files
- `next.config.ts` - Added reverse proxy rewrites for PostHog ingestion
- `components/todos/todo-list.tsx` - Added client-side event tracking
- `app/api/todos/route.ts` - Added server-side event tracking for todo creation
- `app/api/todos/[id]/route.ts` - Added server-side event tracking for todo updates and deletes

## Next steps

To visualize your analytics data, create a dashboard in PostHog with the following suggested insights:

1. **Todo Creation Trend** - Track `todo_created` events over time
2. **Task Completion Funnel** - Funnel from `todo_created` to `todo_completed`
3. **Todo Operations Breakdown** - Pie chart of `todo_created`, `todo_completed`, `todo_deleted`
4. **Error Rate** - Track `todo_create_failed` and `api_todo_create_error` events
5. **API Activity** - Monitor server-side events (`api_todo_created`, `api_todo_updated`, `api_todo_deleted`)

Visit your PostHog dashboard to create these insights:
- [PostHog US](https://us.posthog.com)
- [PostHog EU](https://eu.posthog.com)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
