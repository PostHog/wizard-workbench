# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 Todo application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+)
- **Reverse proxy configuration** in `next.config.ts` to route PostHog requests through `/ingest` path
- **Environment variables** in `.env` for secure configuration
- **Event tracking** for all core todo operations with contextual properties
- **Error tracking** with `posthog.captureException()` for all API failures

## Events Integrated

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | User creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_create_failed` | Error occurred when creating a todo | `components/todos/todo-list.tsx` |
| `todo_update_failed` | Error occurred when updating a todo | `components/todos/todo-list.tsx` |
| `todo_delete_failed` | Error occurred when deleting a todo | `components/todos/todo-list.tsx` |
| `todos_fetch_failed` | Error occurred when fetching todos | `components/todos/todo-list.tsx` |

## Files Created/Modified

| File | Action | Purpose |
|------|--------|---------|
| `.env` | Created | PostHog environment variables |
| `instrumentation-client.ts` | Created | Client-side PostHog initialization |
| `next.config.ts` | Modified | Added rewrites for PostHog reverse proxy |
| `components/todos/todo-list.tsx` | Modified | Added event tracking and error capture |

## Next steps

To visualize your analytics data, create a dashboard in PostHog with the following recommended insights:

### Recommended Insights to Create

1. **Todo Activity Trends** - Track `todo_created`, `todo_completed`, `todo_deleted` over time
2. **Todo Completion Funnel** - Funnel from `todo_created` → `todo_completed`
3. **Error Rate Monitor** - Track all `*_failed` events to monitor application health
4. **Completion vs Deletion Ratio** - Compare `todo_completed` vs `todo_deleted` to understand user behavior
5. **Active User Engagement** - Unique users performing any todo action

### Create Your Dashboard

1. Go to [PostHog Dashboards](https://us.posthog.com/dashboard)
2. Click "New dashboard" and name it "Todo App Analytics"
3. Add insights using the events listed above

### Additional Features Available

- **Session Replay**: Automatically enabled to watch user sessions
- **Error Tracking**: Exceptions are captured via `capture_exceptions: true`
- **Automatic Pageviews**: PostHog captures pageviews automatically

## Configuration Details

- **API Key**: Stored in `NEXT_PUBLIC_POSTHOG_KEY`
- **Host**: Stored in `NEXT_PUBLIC_POSTHOG_HOST`
- **Reverse Proxy**: Requests routed through `/ingest` to avoid ad blockers
