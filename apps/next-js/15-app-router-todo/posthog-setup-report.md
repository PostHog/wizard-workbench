# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 15 App Router Todo application with PostHog analytics. The integration includes both client-side and server-side event tracking, with automatic error capturing and a reverse proxy setup for improved data collection reliability.

## Integration Summary

### Files Created
- `instrumentation-client.ts` - Client-side PostHog initialization using the recommended Next.js 15.3+ approach
- `lib/posthog-server.ts` - Server-side PostHog client for API route tracking
- `.env` - Environment variables for PostHog configuration

### Files Modified
- `next.config.ts` - Added PostHog reverse proxy rewrites for `/ingest` routes
- `components/todos/todo-list.tsx` - Added client-side event tracking
- `app/api/todos/route.ts` - Added server-side event tracking for todo creation
- `app/api/todos/[id]/route.ts` - Added server-side event tracking for updates and deletions

## Event Tracking

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | User created a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marked a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marked a completed todo item as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deleted a todo item | `components/todos/todo-list.tsx` |
| `todos_fetch_error` | Error occurred while fetching todos from the client | `components/todos/todo-list.tsx` |
| `server_todo_created` | Todo was successfully created via API (server-side) | `app/api/todos/route.ts` |
| `server_todo_updated` | Todo was successfully updated via API (server-side) | `app/api/todos/[id]/route.ts` |
| `server_todo_deleted` | Todo was successfully deleted via API (server-side) | `app/api/todos/[id]/route.ts` |
| `api_error` | An error occurred during an API operation | `app/api/todos/route.ts`, `app/api/todos/[id]/route.ts` |

## Next steps

We recommend creating the following insights in your PostHog dashboard to monitor user behavior:

### Suggested Insights

1. **Todo Completion Funnel** - Track users from todo creation to completion
   - Events: `todo_created` -> `todo_completed`

2. **Todo Activity Trends** - Daily trends of all todo operations
   - Events: `todo_created`, `todo_completed`, `todo_deleted`

3. **Task Completion Rate** - Ratio of completed vs created todos
   - Events: `todo_completed` / `todo_created`

4. **API Error Rate** - Monitor server-side errors
   - Event: `api_error`

5. **User Engagement** - Track active users performing todo operations
   - Events: `todo_created`, `todo_completed`, `todo_deleted`

### PostHog Dashboard Links

- [PostHog Dashboard](https://us.posthog.com/project/2/dashboard)
- [Event Definitions](https://us.posthog.com/project/2/data-management/events)
- [Create New Insight](https://us.posthog.com/project/2/insights/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.

## Environment Variables

Make sure your `.env` file contains:
```
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Features Enabled

- **Product Analytics**: Track user events and behaviors
- **Session Replay**: Automatically enabled via instrumentation-client.ts
- **Error Tracking**: Automatic exception capture via `capture_exceptions: true`
- **Reverse Proxy**: PostHog ingestion through Next.js rewrites for improved reliability
