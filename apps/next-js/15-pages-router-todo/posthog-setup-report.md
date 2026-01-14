# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 Pages Router todo application. The integration follows modern best practices using the `instrumentation-client.ts` approach (available in Next.js 15.3+) for client-side initialization, along with a reverse proxy configuration to improve tracking reliability by avoiding ad blockers.

## Summary of Changes

### Files Created
- **`instrumentation-client.ts`** - PostHog client-side initialization with error tracking and debug mode
- **`.env`** - Environment variables for PostHog API key and host

### Files Modified
- **`next.config.ts`** - Added reverse proxy rewrites for PostHog ingestion
- **`components/todos/todo-list.tsx`** - Added event tracking for all todo operations

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo item as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |

## Event Properties

### todo_created
- `todo_id` - Unique identifier of the created todo
- `todo_title` - Title of the new todo
- `has_description` - Boolean indicating if a description was provided
- `total_todos` - Total count of todos after creation

### todo_completed / todo_uncompleted
- `todo_id` - Unique identifier of the toggled todo
- `todo_title` - Title of the todo

### todo_deleted
- `todo_id` - Unique identifier of the deleted todo
- `todo_title` - Title of the deleted todo
- `was_completed` - Boolean indicating if the todo was completed before deletion
- `remaining_todos` - Total count of todos after deletion

## Automatic Features

The integration automatically provides:
- **Pageview tracking** - Automatic `$pageview` and `$pageleave` events via `defaults: '2025-05-24'`
- **Error tracking** - Automatic exception capture via `capture_exceptions: true`
- **Session replay** - Enabled by default for user behavior analysis

## Next Steps

### Create Dashboard

To create a dashboard with insights based on these events, visit your PostHog project and create:

1. **Todo Creation Funnel** - Track users from first pageview to first todo creation
2. **Completion Rate** - Trend of `todo_completed` vs `todo_uncompleted` events
3. **Deletion Analysis** - Track `todo_deleted` events and whether completed todos are being deleted
4. **User Engagement** - Daily/weekly active users based on todo interactions

### Suggested Insights

1. **Conversion Funnel**: `$pageview` → `todo_created` → `todo_completed`
2. **Completion Trend**: Line chart of `todo_completed` over time
3. **Task Churn**: Ratio of `todo_deleted` to `todo_created`
4. **Active Users**: Unique users performing any todo action

### Agent Skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.

## Configuration Details

- **PostHog Host**: `https://us.i.posthog.com`
- **Reverse Proxy**: `/ingest/*` → PostHog servers
- **Debug Mode**: Enabled in development environment
