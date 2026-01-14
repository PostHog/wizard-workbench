# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 15 App Router project with PostHog analytics. The following changes were made:

1. **Client-side initialization**: Added `instrumentation-client.ts` using the Next.js 15.3+ recommended approach for initializing PostHog on the client side. This file initializes PostHog with exception capturing enabled and debug mode in development.

2. **Reverse proxy configuration**: Updated `next.config.ts` to configure reverse proxy rewrites that route PostHog requests through `/ingest/*`. This improves reliability by avoiding tracking blockers.

3. **Environment variables**: Created `.env` file with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` variables for secure configuration.

4. **Event tracking**: Added PostHog event capture calls to track key user actions in the Todo application.

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | Tracks when a user creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Tracks when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Tracks when a user marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Tracks when a user deletes a todo item | `components/todos/todo-list.tsx` |

## Event Properties

- **todo_created**: `todo_id`, `has_description`
- **todo_completed**: `todo_id`
- **todo_uncompleted**: `todo_id`
- **todo_deleted**: `todo_id`, `was_completed`

## Error Tracking

Exception capturing is automatically enabled via `capture_exceptions: true` in the PostHog initialization. Additionally, `posthog.captureException(error)` is called in catch blocks to track API errors.

## Next steps

To view your analytics, visit your PostHog dashboard at https://us.posthog.com. You can create insights based on these events:

1. **Todo Creation Trend**: Track how many todos are being created over time
2. **Completion Rate**: Calculate the ratio of completed vs uncompleted todos
3. **User Engagement Funnel**: Create a funnel from todo_created -> todo_completed
4. **Churn Indicator**: Monitor todo_deleted events, especially for completed tasks

### Suggested Dashboard Insights

1. **Todos Created (Trend)** - Line chart showing `todo_created` events over time
2. **Todo Completion Funnel** - Funnel: `todo_created` -> `todo_completed`
3. **Task Completion vs Deletion** - Compare `todo_completed` and `todo_deleted` events
4. **Active User Engagement** - Count of users performing todo actions

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.

## Files Modified/Created

- `instrumentation-client.ts` (created)
- `next.config.ts` (modified)
- `.env` (created)
- `components/todos/todo-list.tsx` (modified)
