# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 15 App Router project with PostHog analytics. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` (Next.js 15.3+ pattern)
- **Server-side PostHog client** for API route event tracking
- **Reverse proxy configuration** in `next.config.ts` for improved reliability
- **Event tracking** for all core todo CRUD operations (both client and server-side)
- **Exception capture** for error tracking on failed operations

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | User created a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marked a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marked a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deleted a todo item | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event when a todo is created via API | `app/api/todos/route.ts` |
| `server_todo_updated` | Server-side event when a todo is updated via API | `app/api/todos/[id]/route.ts` |
| `server_todo_deleted` | Server-side event when a todo is deleted via API | `app/api/todos/[id]/route.ts` |

## Files Created/Modified

| File | Change |
|------|--------|
| `instrumentation-client.ts` | Created - Client-side PostHog initialization |
| `lib/posthog-server.ts` | Created - Server-side PostHog client helper |
| `next.config.ts` | Modified - Added reverse proxy rewrites for PostHog |
| `.env` | Created - Environment variables for PostHog API key and host |
| `components/todos/todo-list.tsx` | Modified - Added client-side event tracking |
| `app/api/todos/route.ts` | Modified - Added server-side todo created event |
| `app/api/todos/[id]/route.ts` | Modified - Added server-side update/delete events |

## Next steps

We've implemented comprehensive event tracking for your todo application. To create insights and dashboards:

1. Visit your PostHog dashboard at https://us.i.posthog.com
2. Create a new dashboard named "Analytics basics"
3. Add insights based on these events:
   - **Todo Creation Trend**: Track `todo_created` events over time
   - **Completion Rate**: Funnel from `todo_created` to `todo_completed`
   - **Todo Lifecycle**: Funnel analysis across create -> complete -> delete
   - **Active Usage**: Count of `todo_completed` and `todo_uncompleted` events
   - **Deletion Analysis**: Track `todo_deleted` with `was_completed` property breakdown

### Recommended Dashboard Insights

1. **Task Completion Funnel**: `todo_created` -> `todo_completed` -> `todo_deleted`
2. **Daily Active Tasks**: Total events trend (created, completed, deleted)
3. **Completion vs Deletion**: Compare tasks completed before deletion vs deleted incomplete
4. **Server vs Client Events**: Correlation between client and server-side events

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.
