# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js Pages Router Todo application. The integration includes both client-side and server-side event tracking, enabling comprehensive analytics of user behavior and API operations.

## Integration Summary

### Client-Side Setup
- **instrumentation-client.ts**: Created client-side PostHog initialization using the recommended Next.js 15.3+ approach with automatic exception capture and debug mode in development.
- **Reverse Proxy**: Configured Next.js rewrites in `next.config.ts` to proxy PostHog requests through `/ingest`, improving tracking reliability by avoiding ad blockers.

### Server-Side Setup
- **lib/posthog-server.ts**: Created server-side PostHog client helper with proper configuration for serverless environments (flushAt: 1, flushInterval: 0).

### Environment Variables
- **.env**: Created with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` for secure configuration.

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | Client-side event when a user creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Client-side event when a user marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Client-side event when a user reverts a todo item to not completed | `components/todos/todo-list.tsx` |
| `todo_deleted` | Client-side event when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created_server` | Server-side event when a todo is created via API | `pages/api/todos/index.ts` |
| `todo_updated_server` | Server-side event when a todo is updated via API | `pages/api/todos/[id].ts` |
| `todo_deleted_server` | Server-side event when a todo is deleted via API | `pages/api/todos/[id].ts` |
| `api_error` | Server-side error event when API operations fail (validation or server errors) | `pages/api/todos/index.ts`, `pages/api/todos/[id].ts` |

### Event Properties

All events include relevant context:
- **todo_created**: `todo_id`, `has_description`
- **todo_completed/todo_uncompleted**: `todo_id`
- **todo_deleted**: `todo_id`
- **todo_created_server**: `todo_id`, `has_description`, `source`
- **todo_updated_server**: `todo_id`, `updated_fields`, `completed`, `source`
- **todo_deleted_server**: `todo_id`, `source`
- **api_error**: `error_type`, `endpoint`, `method`, `error_message` (for server errors)

### Error Tracking

Client-side exception capture is enabled via:
- `capture_exceptions: true` in PostHog initialization
- Manual `posthog.captureException(error)` calls in error handlers

## Next steps

### Create an "Analytics basics" Dashboard

Visit your PostHog project and create a dashboard with the following recommended insights:

1. **Todo Activity Overview** - Trends insight showing `todo_created`, `todo_completed`, and `todo_deleted` events over time
2. **Task Completion Funnel** - Funnel insight: `todo_created` → `todo_completed`
3. **API Error Rate** - Trends insight showing `api_error` events, broken down by `error_type`
4. **Client vs Server Events Comparison** - Trends comparing `todo_created` vs `todo_created_server`
5. **Completion Rate** - Formula: `todo_completed` / `todo_created` as a percentage

### Dashboard URL

After creating your dashboard, you can access it at:
`https://us.posthog.com/project/[your-project-id]/dashboard/[dashboard-id]`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Files Modified/Created

| File | Action | Description |
|------|--------|-------------|
| `instrumentation-client.ts` | Created | Client-side PostHog initialization |
| `lib/posthog-server.ts` | Created | Server-side PostHog client helper |
| `next.config.ts` | Modified | Added reverse proxy rewrites for PostHog |
| `.env` | Created | Environment variables for PostHog |
| `components/todos/todo-list.tsx` | Modified | Added client-side event tracking |
| `pages/api/todos/index.ts` | Modified | Added server-side event tracking |
| `pages/api/todos/[id].ts` | Modified | Added server-side event tracking |
