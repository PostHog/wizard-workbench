# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 App Router Todo application. The integration includes client-side event tracking for all key user interactions, automatic pageview capture, error tracking, and a reverse proxy configuration to improve tracking reliability.

## Integration Summary

The following files were created or modified:

| File | Change Type | Description |
|------|-------------|-------------|
| `instrumentation-client.ts` | Created | Client-side PostHog initialization using Next.js 15.3+ instrumentation pattern |
| `next.config.ts` | Modified | Added reverse proxy rewrites for PostHog ingestion to avoid ad blockers |
| `.env` | Created | Environment variables for PostHog API key and host |
| `components/todos/todo-list.tsx` | Modified | Added event tracking for all todo CRUD operations |

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todo created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo uncompleted` | User marks a completed todo item as not completed | `components/todos/todo-list.tsx` |
| `todo deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo create failed` | Error occurred while trying to create a todo | `components/todos/todo-list.tsx` |
| `todo update failed` | Error occurred while trying to update a todo | `components/todos/todo-list.tsx` |
| `todo delete failed` | Error occurred while trying to delete a todo | `components/todos/todo-list.tsx` |
| `todos fetch failed` | Error occurred while fetching the todo list | `components/todos/todo-list.tsx` |

## Configuration Details

- **PostHog Host**: https://us.i.posthog.com
- **Reverse Proxy**: Enabled via Next.js rewrites (`/ingest/*` -> PostHog)
- **Error Tracking**: Enabled via `capture_exceptions: true`
- **Debug Mode**: Enabled in development environment

## Next steps

To view your analytics data, visit your PostHog dashboard and create insights based on the events above. Suggested insights include:

1. **Todo Creation Funnel**: Track how many users create todos and complete them
2. **Task Completion Rate**: Ratio of `todo completed` to `todo created` events
3. **Error Rate Monitoring**: Track `*failed` events to identify issues
4. **User Engagement**: Daily/weekly active users based on todo interactions

### Recommended Dashboard Insights

- **Trend**: Todo creations over time
- **Funnel**: Todo created -> Todo completed conversion
- **Trend**: Error events to monitor app health
- **Retention**: Users who create and complete todos

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.
