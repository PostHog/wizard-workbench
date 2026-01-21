# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 15 App Router todo application. PostHog has been configured with both client-side and server-side event tracking, reverse proxy setup for improved reliability, and exception capture for error monitoring.

## Integration Summary

- **Client-side initialization**: Added `instrumentation-client.ts` for PostHog client initialization (Next.js 15.3+ pattern)
- **Server-side client**: Created `lib/posthog-server.ts` helper for server-side event tracking
- **Reverse proxy**: Configured Next.js rewrites in `next.config.ts` to proxy PostHog requests through `/ingest`
- **Environment variables**: Set up `.env` with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `todo_created` | Tracks when a user successfully creates a new todo item (client-side) | `components/todos/todo-list.tsx` |
| `todo_completed` | Tracks when a user marks a todo as completed (client-side) | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Tracks when a user marks a todo as not completed (client-side) | `components/todos/todo-list.tsx` |
| `todo_deleted` | Tracks when a user deletes a todo item (client-side) | `components/todos/todo-list.tsx` |
| `todo_created_server` | Server-side tracking when a todo is created via API | `app/api/todos/route.ts` |
| `todo_updated_server` | Server-side tracking when a todo is updated via API | `app/api/todos/[id]/route.ts` |
| `todo_deleted_server` | Server-side tracking when a todo is deleted via API | `app/api/todos/[id]/route.ts` |
| `api_error` | Tracks API errors for monitoring and debugging | `app/api/todos/route.ts`, `app/api/todos/[id]/route.ts` |

## Exception Tracking

PostHog exception capture has been added to catch and report errors in:
- `components/todos/todo-list.tsx` - Client-side API call failures

## Next steps

To view your analytics and create insights, visit your PostHog dashboard:

- **PostHog Dashboard**: https://us.posthog.com

### Recommended Insights to Create

1. **Todo Creation Funnel**: Track the conversion from page view to todo creation
2. **Task Completion Rate**: Measure the ratio of `todo_completed` to `todo_created` events
3. **User Engagement**: Track daily/weekly active users based on todo interactions
4. **API Error Rate**: Monitor `api_error` events to identify issues
5. **Feature Usage**: Compare usage of create, complete, and delete actions

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Files Modified/Created

| File | Action |
|------|--------|
| `instrumentation-client.ts` | Created - PostHog client initialization |
| `lib/posthog-server.ts` | Created - Server-side PostHog client |
| `next.config.ts` | Modified - Added reverse proxy rewrites |
| `.env` | Created - Environment variables |
| `components/todos/todo-list.tsx` | Modified - Added client-side event tracking |
| `app/api/todos/route.ts` | Modified - Added server-side event tracking |
| `app/api/todos/[id]/route.ts` | Modified - Added server-side event tracking |
