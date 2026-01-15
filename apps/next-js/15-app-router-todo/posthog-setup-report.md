# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 Todo App. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+)
- **Reverse proxy configuration** in `next.config.ts` to route PostHog requests through your domain
- **Event tracking** for all key user interactions in the todo application
- **Error tracking** with automatic exception capture for failed API operations

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | Triggered when a user creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Triggered when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Triggered when a user marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Triggered when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todos_fetch_failed` | Triggered when fetching todos from the API fails (error tracking) | `components/todos/todo-list.tsx` |
| `todo_create_failed` | Triggered when creating a todo fails (error tracking) | `components/todos/todo-list.tsx` |
| `todo_update_failed` | Triggered when updating a todo fails (error tracking) | `components/todos/todo-list.tsx` |
| `todo_delete_failed` | Triggered when deleting a todo fails (error tracking) | `components/todos/todo-list.tsx` |

## Files Modified/Created

- `instrumentation-client.ts` - Client-side PostHog initialization
- `next.config.ts` - Added rewrites for PostHog reverse proxy
- `components/todos/todo-list.tsx` - Added event tracking for all CRUD operations
- `.env` - Environment variables for PostHog configuration

## Next steps

We've instrumented your application with comprehensive event tracking. To build insights and dashboards:

1. **Run your application** and perform some actions to generate events
2. **Visit PostHog** to create custom dashboards using the events above

### Recommended Insights to Create

Based on the events implemented, consider creating these insights in PostHog:

1. **Todo Creation Funnel** - Track how many todos are created vs completed
2. **Task Completion Rate** - `todo_completed` / (`todo_completed` + `todo_uncompleted`)
3. **User Engagement** - Total todos created over time
4. **Error Rate Monitoring** - Track `*_failed` events to identify issues
5. **Task Lifecycle** - Time from creation to completion

### Dashboard URL

Once you've run the application and generated events, you can create dashboards at:
- https://us.posthog.com/project/YOUR_PROJECT_ID/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.
