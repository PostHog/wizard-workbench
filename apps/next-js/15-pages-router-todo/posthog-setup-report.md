# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 Pages Router Todo application. The integration includes client-side analytics initialization via the `instrumentation-client.ts` file (the recommended approach for Next.js 15.3+), automatic exception tracking, and custom event tracking for all core todo operations. A reverse proxy has been configured in `next.config.ts` to route PostHog requests through your domain, which helps avoid ad blockers and improves data collection reliability.

## Files Created/Modified

| File | Change |
|------|--------|
| `instrumentation-client.ts` | Created - PostHog client initialization with exception tracking |
| `next.config.ts` | Modified - Added rewrites for PostHog reverse proxy |
| `components/todos/todo-list.tsx` | Modified - Added PostHog event captures for all todo operations |
| `.env` | Created - Environment variables for PostHog API key and host |

## Events Instrumented

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_create_failed` | Fired when creating a todo fails due to an error | `components/todos/todo-list.tsx` |
| `todo_update_failed` | Fired when updating a todo fails due to an error | `components/todos/todo-list.tsx` |
| `todo_delete_failed` | Fired when deleting a todo fails due to an error | `components/todos/todo-list.tsx` |
| `todos_fetch_failed` | Fired when fetching the todos list fails due to an error | `components/todos/todo-list.tsx` |

## Event Properties

Each event includes relevant properties:

- **todo_created**: `todo_id`, `has_description`
- **todo_completed/todo_uncompleted**: `todo_id`
- **todo_deleted**: `todo_id`
- **Error events**: `todo_id` (where applicable), `error` (error message)

## Next steps

To visualize your data in PostHog, create a dashboard with the following recommended insights:

1. **Todo Creation Trend** - Track `todo_created` events over time to understand user engagement
2. **Task Completion Funnel** - Create a funnel from `todo_created` -> `todo_completed` to measure conversion
3. **Error Rate Monitoring** - Track all `*_failed` events to monitor application health
4. **User Engagement** - Compare `todo_created`, `todo_completed`, and `todo_deleted` to understand usage patterns
5. **Completion Rate** - Calculate the ratio of `todo_completed` to `todo_created` events

### Creating Your Dashboard

1. Go to your PostHog project: https://us.i.posthog.com
2. Navigate to **Dashboards** > **New Dashboard**
3. Name it "Todo App Analytics"
4. Add insights using the events listed above

### Recommended Insight Configurations

**Task Completion Funnel:**
- Type: Funnel
- Steps: `todo_created` -> `todo_completed`
- Date range: Last 30 days

**Error Monitoring:**
- Type: Trends
- Events: `todo_create_failed`, `todo_update_failed`, `todo_delete_failed`, `todos_fetch_failed`
- Date range: Last 7 days

## Configuration Details

- **PostHog Host**: Configured via `NEXT_PUBLIC_POSTHOG_HOST` environment variable
- **API Key**: Configured via `NEXT_PUBLIC_POSTHOG_KEY` environment variable
- **Reverse Proxy**: Enabled at `/ingest` path
- **Exception Tracking**: Enabled via `capture_exceptions: true`
- **Debug Mode**: Enabled in development environment
