# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 Pages Router todo application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the recommended Next.js 15.3+ approach
- **Server-side PostHog client** in `lib/posthog-server.ts` for future server-side tracking needs
- **Reverse proxy configuration** in `next.config.ts` to route PostHog requests through `/ingest` for better ad-blocker resilience
- **Environment variables** configured in `.env` with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`
- **Automatic error tracking** enabled via `capture_exceptions: true`
- **Event tracking** for all todo CRUD operations with relevant properties

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | User creates a new todo item - key engagement metric | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed - conversion/success metric | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo as incomplete - behavioral insight | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo - potential churn indicator | `components/todos/todo-list.tsx` |
| `todos_fetch_failed` | Error occurred when fetching todos - error tracking | `components/todos/todo-list.tsx` |
| `todo_create_failed` | Error occurred when creating a todo - error tracking | `components/todos/todo-list.tsx` |
| `todo_update_failed` | Error occurred when updating a todo - error tracking | `components/todos/todo-list.tsx` |
| `todo_delete_failed` | Error occurred when deleting a todo - error tracking | `components/todos/todo-list.tsx` |

## Files Created/Modified

| File | Action | Purpose |
|------|--------|---------|
| `.env` | Created | Environment variables for PostHog API key and host |
| `instrumentation-client.ts` | Created | Client-side PostHog initialization |
| `lib/posthog-server.ts` | Created | Server-side PostHog client |
| `next.config.ts` | Modified | Added rewrites for PostHog reverse proxy |
| `components/todos/todo-list.tsx` | Modified | Added event tracking for all todo operations |

## Next steps

To create insights and dashboards for tracking user behavior based on the events instrumented:

1. **Log into PostHog**: https://us.posthog.com
2. **Create a new dashboard** named "Todo App Analytics"
3. **Add the following recommended insights**:

### Suggested Insights to Create

1. **Todo Creation Funnel**
   - Type: Funnel
   - Steps: `$pageview` (homepage) → `todo_created`
   - Purpose: Track conversion from page visit to creating first todo

2. **Task Completion Rate**
   - Type: Trends
   - Events: `todo_created`, `todo_completed`
   - Purpose: Compare creation vs completion rates over time

3. **User Engagement Trends**
   - Type: Trends
   - Events: `todo_created`, `todo_completed`, `todo_deleted`
   - Purpose: Track overall user engagement with the app

4. **Error Rate Monitoring**
   - Type: Trends
   - Events: `todos_fetch_failed`, `todo_create_failed`, `todo_update_failed`, `todo_delete_failed`
   - Purpose: Monitor application health and error rates

5. **Churn Indicator Analysis**
   - Type: Trends
   - Events: `todo_deleted` (filtered by `was_completed: false`)
   - Purpose: Track users deleting incomplete todos (potential churn signal)

## Configuration Reference

- **PostHog Host**: https://us.i.posthog.com
- **Reverse Proxy Endpoint**: `/ingest`
- **Environment Variables**:
  - `NEXT_PUBLIC_POSTHOG_KEY`: Your PostHog project API key
  - `NEXT_PUBLIC_POSTHOG_HOST`: https://us.i.posthog.com
