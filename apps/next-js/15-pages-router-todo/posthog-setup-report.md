# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 Pages Router todo application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the recommended approach for Next.js 15.3+
- **Reverse proxy configuration** in `next.config.ts` to route PostHog requests through `/ingest` for better ad-blocker resistance
- **Environment variables** configured in `.env` with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`
- **Event tracking** for all CRUD operations on todos
- **Error tracking** using `posthog.captureException()` for all API failures
- **Automatic exception capture** enabled via `capture_exceptions: true`

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo item as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_fetch_failed` | Error occurred while fetching todos from the API | `components/todos/todo-list.tsx` |
| `todo_create_failed` | Error occurred while creating a new todo | `components/todos/todo-list.tsx` |
| `todo_update_failed` | Error occurred while updating a todo | `components/todos/todo-list.tsx` |
| `todo_delete_failed` | Error occurred while deleting a todo | `components/todos/todo-list.tsx` |

## Files Created/Modified

| File | Change |
|------|--------|
| `.env` | Created with PostHog environment variables |
| `instrumentation-client.ts` | Created for client-side PostHog initialization |
| `next.config.ts` | Modified to add PostHog reverse proxy rewrites |
| `components/todos/todo-list.tsx` | Modified to add event tracking and error capture |

## Next steps

Once your application is deployed and users start interacting with it, you can create insights and dashboards in PostHog based on the events instrumented above. Recommended insights include:

1. **Todo Creation Trend** - Track `todo_created` events over time to understand user engagement
2. **Todo Completion Funnel** - Create a funnel from `todo_created` -> `todo_completed` to measure task completion rates
3. **Error Rate Monitoring** - Track all `*_failed` events to monitor application health
4. **User Activity** - Combine all todo events to see overall user activity patterns
5. **Completion vs Deletion Ratio** - Compare `todo_completed` vs `todo_deleted` to understand user behavior

Visit your PostHog dashboard at: https://us.posthog.com

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.
