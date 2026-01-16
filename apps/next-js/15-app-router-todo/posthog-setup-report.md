# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 15 App Router todo application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+)
- **Server-side tracking** via `lib/posthog-server.ts` for API route events
- **Reverse proxy configuration** in `next.config.ts` to improve tracking reliability
- **Environment variables** configured in `.env` for PostHog API key and host
- **Event tracking** for all todo CRUD operations (create, complete, uncomplete, delete)
- **Error tracking** with `posthog.captureException()` for client-side errors

## Events

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | Fired when a user successfully creates a new todo item (client-side) | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed (client-side) | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user marks a completed todo as incomplete (client-side) | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item (client-side) | `components/todos/todo-list.tsx` |
| `todo_created_server` | Server-side event fired when a todo is created via API | `app/api/todos/route.ts` |
| `todo_updated_server` | Server-side event fired when a todo is updated via API | `app/api/todos/[id]/route.ts` |
| `todo_deleted_server` | Server-side event fired when a todo is deleted via API | `app/api/todos/[id]/route.ts` |

## Files Modified/Created

- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client helper
- `next.config.ts` - Added reverse proxy rewrites for PostHog
- `.env` - Environment variables for PostHog configuration
- `components/todos/todo-list.tsx` - Added client-side event tracking
- `app/api/todos/route.ts` - Added server-side event tracking for POST
- `app/api/todos/[id]/route.ts` - Added server-side event tracking for PATCH and DELETE

## Next steps

We've set up the event tracking infrastructure. To view analytics and create dashboards:

1. Log into your PostHog dashboard at https://us.posthog.com
2. Navigate to **Data Management > Events** to see your tracked events
3. Create insights and dashboards based on the events above

### Recommended Insights to Create

1. **Todo Creation Funnel** - Track todo_created events over time
2. **Task Completion Rate** - Compare todo_completed vs todo_created
3. **User Engagement** - Monitor daily active users based on event activity
4. **Churn Indicator** - Track todo_deleted events to understand abandonment

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
