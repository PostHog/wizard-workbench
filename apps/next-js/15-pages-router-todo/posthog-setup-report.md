# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js Pages Router todo application. The integration includes both client-side and server-side event tracking, automatic pageview capture, session replay, and error tracking capabilities.

## Integration Summary

### Files Created
- `instrumentation-client.ts` - Client-side PostHog initialization using the recommended Next.js 15.3+ approach
- `lib/posthog-server.ts` - Server-side PostHog client for API route tracking
- `.env.local` - Environment variables for PostHog configuration

### Files Modified
- `next.config.ts` - Added reverse proxy rewrites for PostHog to avoid ad blockers
- `components/todos/todo-list.tsx` - Added client-side event tracking for todo operations
- `pages/api/todos/index.ts` - Added server-side event tracking for todo creation
- `pages/api/todos/[id].ts` - Added server-side event tracking for todo updates and deletions

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user marks a completed todo item as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_create_failed` | Fired when creating a todo fails (client-side error) | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event fired when a todo is successfully created via API | `pages/api/todos/index.ts` |
| `server_todo_updated` | Server-side event fired when a todo is successfully updated via API | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server-side event fired when a todo is successfully deleted via API | `pages/api/todos/[id].ts` |
| `server_validation_error` | Server-side event fired when validation fails on API endpoints | `pages/api/todos/index.ts` |
| `server_api_error` | Server-side event fired when an unexpected error occurs in API handlers | `pages/api/todos/[id].ts` |

## Next steps

Once your application is running and users begin interacting with it, you'll see events flowing into PostHog. You can create insights and dashboards based on the events we've instrumented:

### Suggested Insights to Create

1. **Todo Creation Trend** - Track `todo_created` events over time to see user engagement
2. **Todo Completion Funnel** - Create a funnel from `todo_created` -> `todo_completed` to measure task completion rates
3. **Error Rate Monitoring** - Track `server_api_error` and `todo_create_failed` events to monitor application health
4. **User Engagement** - Track daily/weekly active users based on todo operations

### PostHog Dashboard

Visit your PostHog dashboard to create custom insights:
- [PostHog Dashboard](https://us.posthog.com)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Configuration Details

### Environment Variables
```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Features Enabled
- Automatic pageview capture (via `defaults: '2025-11-30'`)
- Session replay
- Exception capture (`capture_exceptions: true`)
- Reverse proxy through `/ingest` to avoid ad blockers
- Debug mode in development environment
