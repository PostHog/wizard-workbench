# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 App Router Todo application. The integration includes both client-side and server-side event tracking, with automatic error capture and exception tracking enabled.

## Integration Summary

- **Client-side initialization**: Added `instrumentation-client.ts` for PostHog client-side SDK initialization with automatic exception capture
- **Server-side SDK**: Created `lib/posthog-server.ts` helper for server-side event tracking in API routes
- **Reverse proxy**: Configured Next.js rewrites in `next.config.ts` to proxy PostHog requests through `/ingest` to avoid ad blockers
- **Environment variables**: Configured `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` in `.env.local`

## Events Tracked

| Event Name | Description | File |
|------------|-------------|------|
| `todo created` | User creates a new todo item | `components/todos/todo-list.tsx`, `app/api/todos/route.ts` |
| `todo completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo uncompleted` | User marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo deleted` | User deletes a todo item | `components/todos/todo-list.tsx`, `app/api/todos/[id]/route.ts` |
| `todo updated` | Server-side: A todo was updated via API | `app/api/todos/[id]/route.ts` |
| `todo create failed` | Error occurred when attempting to create a todo | `components/todos/todo-list.tsx` |
| `todo update failed` | Error occurred when attempting to update a todo | `components/todos/todo-list.tsx` |
| `todo delete failed` | Error occurred when attempting to delete a todo | `components/todos/todo-list.tsx` |
| `api error` | Server-side: An error occurred in the API routes | `app/api/todos/route.ts`, `app/api/todos/[id]/route.ts` |

## Files Created/Modified

| File | Action | Description |
|------|--------|-------------|
| `instrumentation-client.ts` | Created | PostHog client-side initialization |
| `lib/posthog-server.ts` | Created | Server-side PostHog client helper |
| `next.config.ts` | Modified | Added reverse proxy rewrites for PostHog |
| `.env.local` | Created | Environment variables for PostHog configuration |
| `components/todos/todo-list.tsx` | Modified | Added client-side event tracking |
| `app/api/todos/route.ts` | Modified | Added server-side event tracking |
| `app/api/todos/[id]/route.ts` | Modified | Added server-side event tracking |

## Next steps

We recommend building insights and a dashboard in PostHog to monitor user behavior based on the events instrumented:

### Recommended Insights

1. **Todo Creation Funnel**: Track how many users create todos and the success rate
2. **Task Completion Rate**: Monitor how many todos are being completed vs. created
3. **Error Rate Tracking**: Keep an eye on `api error` and failed operation events
4. **User Engagement**: Track daily/weekly todo creation and completion trends
5. **Churn Indicator**: Monitor users who delete todos without completing them

### Dashboard Setup

Visit your [PostHog Dashboard](https://us.posthog.com) to create custom insights based on these events.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
