# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 Todo application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+)
- **Reverse proxy configuration** in `next.config.ts` to route PostHog requests through `/ingest` for better ad-blocker resistance
- **Event tracking** for all todo CRUD operations with meaningful properties
- **Error tracking** using `posthog.captureException()` for all failed operations
- **Environment variables** configured in `.env` for secure API key management

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo item as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_create_failed` | Todo creation failed due to an error | `components/todos/todo-list.tsx` |
| `todo_update_failed` | Todo update failed due to an error | `components/todos/todo-list.tsx` |
| `todo_delete_failed` | Todo deletion failed due to an error | `components/todos/todo-list.tsx` |
| `todos_load_failed` | Failed to load todos from the API | `components/todos/todo-list.tsx` |

## Files Modified/Created

- `instrumentation-client.ts` - PostHog client-side initialization
- `next.config.ts` - Added rewrites for PostHog reverse proxy
- `components/todos/todo-list.tsx` - Added event tracking and error capture
- `.env` - Environment variables for PostHog configuration

## Next steps

Once you start using the application, events will be captured and sent to PostHog. You can then:

1. View events in the PostHog dashboard at https://us.posthog.com
2. Create funnels to track todo completion rates (e.g., `todo_created` -> `todo_completed`)
3. Monitor error rates using the error tracking events
4. Set up alerts for high error rates
5. Create retention cohorts based on todo activity

## Recommended Dashboard Insights

Consider creating these insights in PostHog:

1. **Todo Creation Funnel**: Track `todo_created` -> `todo_completed` conversion
2. **Daily Active Todos**: Trend of `todo_created` events over time
3. **Completion Rate**: Ratio of `todo_completed` to `todo_created`
4. **Error Rate Monitor**: Track all `*_failed` events
5. **Todo Lifecycle**: Distribution of todo operations (`created`, `completed`, `deleted`)
