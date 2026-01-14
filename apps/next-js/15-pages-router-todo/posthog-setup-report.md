# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 Pages Router todo application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the modern Next.js 15.3+ approach
- **Server-side PostHog client** for potential server-side event tracking in API routes
- **Reverse proxy configuration** to route PostHog requests through your domain (ad-blocker bypass)
- **Comprehensive event tracking** for all todo CRUD operations
- **Error tracking** with `captureException()` for failed operations

## Events Added

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | User created a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marked a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User unmarked a todo (set back to incomplete) | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deleted a todo item | `components/todos/todo-list.tsx` |
| `todos_fetch_failed` | Failed to fetch todos (error tracking) | `components/todos/todo-list.tsx` |
| `todo_create_failed` | Failed to create a todo (error tracking) | `components/todos/todo-list.tsx` |
| `todo_update_failed` | Failed to update a todo (error tracking) | `components/todos/todo-list.tsx` |
| `todo_delete_failed` | Failed to delete a todo (error tracking) | `components/todos/todo-list.tsx` |

## Files Created/Modified

| File | Change |
|------|--------|
| `instrumentation-client.ts` | Created - PostHog client-side initialization |
| `lib/posthog-server.ts` | Created - Server-side PostHog client |
| `next.config.ts` | Modified - Added PostHog proxy rewrites |
| `components/todos/todo-list.tsx` | Modified - Added event tracking for all operations |
| `.env` | Created - Environment variables for PostHog |

## Next steps

### Create a Dashboard

To monitor your todo application's user behavior, create a dashboard in PostHog with these recommended insights:

1. **Todo Conversion Funnel**: Track the journey from page view → todo_created → todo_completed
2. **Todo Activity Trend**: Daily count of todo_created, todo_completed, and todo_deleted events
3. **Completion Rate**: Ratio of todo_completed to todo_created
4. **Error Rate**: Track error events (todo_create_failed, etc.) to monitor API health
5. **User Engagement**: Unique users performing todo actions over time

### Recommended Dashboard Setup

Visit your PostHog dashboard at https://us.posthog.com and create insights using the event names above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.

## Environment Variables

The following environment variables have been configured in `.env`:

```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Make sure to add `.env` to your `.gitignore` file and use `.env.local` or environment-specific files for production deployments.
