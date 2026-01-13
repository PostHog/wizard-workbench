# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 Todo App. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+)
- **Server-side PostHog client** in `lib/posthog-server.ts` for future server-side event tracking
- **Reverse proxy configuration** in `next.config.ts` to route PostHog requests through `/ingest` for better reliability and ad-blocker bypass
- **Environment variables** configured in `.env` with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`
- **Error tracking** enabled with `capture_exceptions: true` and explicit `captureException()` calls in error handlers
- **Event tracking** for all core todo operations

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `todo_created` | User successfully created a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marked a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marked a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deleted a todo item | `components/todos/todo-list.tsx` |
| `todo_fetch_failed` | Failed to fetch todos from the API | `components/todos/todo-list.tsx` |
| `todo_create_failed` | Failed to create a new todo | `components/todos/todo-list.tsx` |
| `todo_update_failed` | Failed to update a todo | `components/todos/todo-list.tsx` |
| `todo_delete_failed` | Failed to delete a todo | `components/todos/todo-list.tsx` |

## Files Created/Modified

| File | Change Type | Description |
|------|-------------|-------------|
| `.env` | Created | Environment variables for PostHog configuration |
| `instrumentation-client.ts` | Created | Client-side PostHog initialization |
| `lib/posthog-server.ts` | Created | Server-side PostHog client for API routes |
| `next.config.ts` | Modified | Added rewrites for PostHog reverse proxy |
| `components/todos/todo-list.tsx` | Modified | Added event tracking and error capture |

## Next steps

To build insights and a dashboard based on these events, create the following in your PostHog project:

### Recommended Insights

1. **Todo Creation Funnel** - Track the conversion from page view to todo creation
   - `$pageview` (pathname = "/") -> `todo_created`

2. **Todo Completion Rate** - Track how many todos get completed vs created
   - Compare `todo_created` vs `todo_completed` over time

3. **Task Lifecycle** - Trend of all todo operations
   - `todo_created`, `todo_completed`, `todo_uncompleted`, `todo_deleted`

4. **Error Rate** - Monitor application health
   - `todo_fetch_failed`, `todo_create_failed`, `todo_update_failed`, `todo_delete_failed`

5. **Engagement Retention** - Track returning users who complete todos
   - Retention analysis based on `todo_completed` event

### Create Dashboard

Visit your PostHog project to create a new dashboard:
- [PostHog Dashboards](https://us.posthog.com/project/dashboards)

### Automatic Features Enabled

- **Session Replay** - Automatically records user sessions
- **Error Tracking** - Captures unhandled exceptions automatically
- **Pageviews** - Automatically captured via PostHog defaults
