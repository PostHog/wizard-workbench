# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 15 App Router todo application with PostHog analytics. The integration includes client-side event tracking for user interactions and server-side error tracking for API failures.

## Integration Summary

### Files Created
- `instrumentation-client.ts` - Client-side PostHog initialization using the modern Next.js 15.3+ approach
- `lib/posthog-server.ts` - Server-side PostHog client for API route tracking

### Files Modified
- `next.config.ts` - Added reverse proxy rewrites to route PostHog requests through your domain
- `components/todos/todo-list.tsx` - Added client-side event tracking for todo CRUD operations
- `app/api/todos/route.ts` - Added server-side error tracking for todo creation failures
- `app/api/todos/[id]/route.ts` - Added server-side error tracking for todo update and delete failures
- `.env.local` - Added PostHog environment variables

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a todo as not completed (reverting completion) | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_create_failed` | Server-side: Todo creation failed due to validation or server error | `app/api/todos/route.ts` |
| `todo_update_failed` | Server-side: Todo update failed due to validation or server error | `app/api/todos/[id]/route.ts` |
| `todo_delete_failed` | Server-side: Todo deletion failed due to server error | `app/api/todos/[id]/route.ts` |

## Additional Features

### Error Tracking
- Client-side exceptions are automatically captured via `capture_exceptions: true`
- Manual exception capture added to catch blocks using `posthog.captureException(error)`

### Reverse Proxy
- PostHog requests are proxied through `/ingest` to improve tracking reliability and avoid ad blockers

## Next steps

Once you start using the app, you can create insights and dashboards in PostHog based on these events. Recommended insights:

1. **Todo Creation Trend** - Track how many todos are being created over time
2. **Completion Rate Funnel** - Track the flow from todo creation to completion
3. **Task Deletion Analysis** - Understand when and why users delete tasks
4. **Error Rate Monitoring** - Track server-side failures for todo operations

Visit your PostHog dashboard at: https://us.posthog.com

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
