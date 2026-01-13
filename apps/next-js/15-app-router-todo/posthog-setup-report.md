# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 Todo App. The integration includes client-side event tracking for all core todo operations, automatic error tracking via `capture_exceptions`, and a reverse proxy setup to route PostHog requests through your domain for improved reliability and ad-blocker resistance.

## Files Created/Modified

| File | Change |
|------|--------|
| `instrumentation-client.ts` | Created - PostHog client-side initialization with error tracking enabled |
| `next.config.ts` | Modified - Added rewrites for PostHog reverse proxy |
| `components/todos/todo-list.tsx` | Modified - Added event tracking for all todo operations |
| `.env` | Created - Environment variables for PostHog API key and host |

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todos_loaded` | User loads the todo list successfully | `components/todos/todo-list.tsx` |
| `todo_created` | User creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a todo item as not completed (reopens) | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todos_fetch_failed` | Failed to fetch todos on load (error) | `components/todos/todo-list.tsx` |
| `todo_create_failed` | Failed to create a todo item (error) | `components/todos/todo-list.tsx` |
| `todo_update_failed` | Failed to update a todo item (error) | `components/todos/todo-list.tsx` |
| `todo_delete_failed` | Failed to delete a todo item (error) | `components/todos/todo-list.tsx` |

## Event Properties

Each event includes relevant properties for deeper analysis:

- **todos_loaded**: `todo_count`, `active_count`, `completed_count`
- **todo_created**: `todo_id`, `has_description`, `title_length`, `total_todos`
- **todo_completed/uncompleted**: `todo_id`
- **todo_deleted**: `todo_id`, `remaining_todos`
- **Error events**: `error_message`, `todo_id` (where applicable)

## Next steps

To get the most out of your PostHog integration, we recommend creating a dashboard in PostHog with the following insights:

1. **Todo Creation Funnel**: Track `todos_loaded` -> `todo_created` -> `todo_completed` to understand task completion rates
2. **Task Completion Rate**: Compare `todo_created` vs `todo_completed` events over time
3. **Error Monitoring**: Track all `*_failed` events to identify reliability issues
4. **User Engagement**: Monitor `todos_loaded` to understand daily active usage
5. **Task Lifecycle**: Analyze `todo_deleted` vs `todo_completed` to understand how users handle tasks

### Create Your Dashboard

Visit your PostHog project to create insights and dashboards:

- **PostHog Dashboard**: https://us.posthog.com/project/dashboards
- **Create New Insight**: https://us.posthog.com/project/insights/new

### Recommended Insights to Create

1. **Todos Created Over Time** (Trends) - Track `todo_created` event daily
2. **Task Completion Funnel** (Funnel) - `todo_created` -> `todo_completed`
3. **Error Rate** (Trends) - Track all `*_failed` events
4. **Active Users** (Trends) - Unique users triggering `todos_loaded`
5. **Task Outcomes** (Trends) - Compare `todo_completed` vs `todo_deleted`
