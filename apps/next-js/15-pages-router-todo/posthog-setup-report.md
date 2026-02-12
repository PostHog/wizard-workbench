# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 Pages Router todo application. The integration includes client-side event tracking, server-side error tracking, a reverse proxy setup for improved reliability, and automatic exception capturing.

## Events Added

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | Fired when a user creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_create_failed` | Server-side: Fired when todo creation fails | `pages/api/todos/index.ts` |
| `todo_update_failed` | Server-side: Fired when todo update fails | `pages/api/todos/[id].ts` |
| `todo_delete_failed` | Server-side: Fired when todo deletion fails | `pages/api/todos/[id].ts` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - Client-side PostHog initialization with error tracking enabled
- `lib/posthog-server.ts` - Server-side PostHog client for API route tracking

### Modified Files
- `next.config.ts` - Added reverse proxy rewrites for PostHog ingestion
- `components/todos/todo-list.tsx` - Added client-side event tracking for todo CRUD operations
- `pages/api/todos/index.ts` - Added server-side error tracking for todo creation
- `pages/api/todos/[id].ts` - Added server-side error tracking for todo updates and deletions
- `.env.local` - Added PostHog API key and host environment variables

## Configuration

### Environment Variables
```
NEXT_PUBLIC_POSTHOG_KEY=<your-api-key>
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Features Enabled
- **Automatic Pageviews**: Using `defaults: '2026-01-30'` for proper SPA pageview tracking
- **Exception Tracking**: `capture_exceptions: true` for automatic error capture
- **Reverse Proxy**: Requests routed through `/ingest` to avoid ad blockers
- **Debug Mode**: Enabled in development environment

## Next steps

### Recommended Dashboard Insights

Create a dashboard in PostHog with the following insights:

1. **Todo Creation Trend** - Track `todo_created` events over time to understand user engagement
2. **Task Completion Rate** - Funnel from `todo_created` → `todo_completed` to measure productivity
3. **Todo Lifecycle** - Track the journey from creation to completion or deletion
4. **Error Monitoring** - Monitor `todo_create_failed`, `todo_update_failed`, and `todo_delete_failed` events
5. **User Retention** - Track returning users based on todo interactions

Visit your [PostHog dashboard](https://us.posthog.com) to create these insights manually.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
