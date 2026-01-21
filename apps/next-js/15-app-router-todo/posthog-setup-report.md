# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 15 App Router Todo application. PostHog has been integrated for both client-side and server-side analytics using the `instrumentation-client.ts` pattern (recommended for Next.js 15.3+) and the `posthog-node` SDK for API routes.

## Integration Summary

The following files were created or modified:

| File | Change |
|------|--------|
| `.env` | Added PostHog environment variables |
| `instrumentation-client.ts` | Created client-side PostHog initialization |
| `next.config.ts` | Added reverse proxy rewrites for PostHog ingestion |
| `lib/posthog-server.ts` | Created server-side PostHog client |
| `components/todos/todo-list.tsx` | Added client-side event tracking |
| `app/api/todos/route.ts` | Added server-side event tracking |
| `app/api/todos/[id]/route.ts` | Added server-side event tracking |

## Events Tracked

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | Fired when a user successfully creates a new todo item (client) | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed (client) | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user marks a completed todo as incomplete (client) | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item (client) | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event when a todo is created via the API | `app/api/todos/route.ts` |
| `server_todo_updated` | Server-side event when a todo is updated via the API | `app/api/todos/[id]/route.ts` |
| `server_todo_deleted` | Server-side event when a todo is deleted via the API | `app/api/todos/[id]/route.ts` |

## Features Enabled

- **Automatic pageview tracking**: Via `defaults: '2025-05-24'` configuration
- **Exception capture**: Automatic error tracking enabled via `capture_exceptions: true`
- **Manual exception capture**: Added `posthog.captureException()` in error handlers
- **Reverse proxy**: PostHog requests routed through `/ingest` to avoid ad blockers
- **Debug mode**: Enabled in development environment

## Next steps

### Create a Dashboard

Create an "Analytics basics" dashboard in PostHog with the following suggested insights:

1. **Todo Creation Trend** - Track `todo_created` events over time
2. **Task Completion Funnel** - Funnel from `todo_created` → `todo_completed`
3. **Todo Activity Breakdown** - Pie chart of all todo events
4. **Task Deletion Rate** - Track `todo_deleted` events as a percentage of created todos
5. **Server vs Client Events** - Compare server-side and client-side event volumes

Visit your PostHog dashboard: https://us.posthog.com

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Environment Variables

Make sure the following environment variables are set in your deployment environment:

```
NEXT_PUBLIC_POSTHOG_KEY=phc_sBGFIjin7AfcLwLJ4yc79wY84KHkvrTw5SnUeKD0SWE
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```
