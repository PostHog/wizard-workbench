# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 Pages Router todo application. The integration includes client-side event tracking using `posthog-js`, server-side event tracking using `posthog-node`, a reverse proxy setup for ad-blocker bypass, and automatic exception capture.

## Integration Summary

### Files Created
- `instrumentation-client.ts` - Client-side PostHog initialization (Next.js 15.3+ pattern)
- `lib/posthog-server.ts` - Server-side PostHog client singleton
- `.env` - Environment variables for PostHog configuration

### Files Modified
- `next.config.ts` - Added reverse proxy rewrites for PostHog ingestion
- `components/todos/todo-list.tsx` - Added client-side event tracking
- `pages/api/todos/index.ts` - Added server-side event tracking for todo creation
- `pages/api/todos/[id].ts` - Added server-side event tracking for todo updates and deletions

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todo created` | User created a new todo item (client-side) | `components/todos/todo-list.tsx` |
| `todo completed` | User marked a todo as completed (client-side) | `components/todos/todo-list.tsx` |
| `todo uncompleted` | User unmarked a todo as incomplete (client-side) | `components/todos/todo-list.tsx` |
| `todo deleted` | User deleted a todo item (client-side) | `components/todos/todo-list.tsx` |
| `server todo created` | A todo was successfully created on the server | `pages/api/todos/index.ts` |
| `server todo updated` | A todo was successfully updated on the server | `pages/api/todos/[id].ts` |
| `server todo deleted` | A todo was successfully deleted on the server | `pages/api/todos/[id].ts` |

## Event Properties

### Client-side events
- `todo_id` - The ID of the todo item
- `has_description` - Boolean indicating if the todo has a description (for `todo created`)

### Server-side events
- `todo_id` - The ID of the todo item
- `has_description` - Boolean indicating if the todo has a description (for `server todo created`)
- `completed` - Boolean indicating completion status (for `server todo updated`)
- `source` - Always "api" to indicate server-side origin

## Error Tracking

Exception capture has been enabled globally via `capture_exceptions: true` in the instrumentation client. Additionally, specific error handlers in the todo list component use `posthog.captureException(error)` to track errors during todo operations.

## Next steps

Once you start using the application, events will flow into PostHog. You can then create insights and dashboards to track:

1. **Todo Creation Funnel** - Track how many users create todos and whether they include descriptions
2. **Task Completion Rate** - Monitor the ratio of completed vs uncompleted todos
3. **User Engagement** - Track daily/weekly active users based on todo interactions
4. **Churn Events** - Monitor todo deletion patterns

Visit your PostHog dashboard at: https://us.posthog.com

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
