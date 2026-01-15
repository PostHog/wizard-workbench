# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 15 App Router todo application with PostHog analytics. The integration includes client-side event tracking, automatic pageview capture, session replay, error tracking, and a reverse proxy setup to improve tracking reliability.

## Integration Summary

The following files were created or modified:

| File | Change Type | Description |
|------|-------------|-------------|
| `instrumentation-client.ts` | Created | PostHog client-side initialization using Next.js 15.3+ instrumentation |
| `next.config.ts` | Modified | Added reverse proxy rewrites for PostHog to avoid ad blockers |
| `components/todos/todo-list.tsx` | Modified | Added event tracking for todo CRUD operations |
| `.env.local` | Configured | Environment variables for PostHog API key and host |

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | User creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `$pageview` | Automatic pageview capture (all pages) | `instrumentation-client.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://us.posthog.com/project/2/dashboard/1055491) - Core analytics dashboard for tracking todo app user behavior

### Insights
- [Todo Activity Over Time](https://us.posthog.com/project/2/insights/z7RFCEJI) - Daily trends of todo creation, completion, and deletion
- [Todo Completion Funnel](https://us.posthog.com/project/2/insights/4rWbgOha) - Conversion funnel from creating to completing todos
- [Daily Active Users](https://us.posthog.com/project/2/insights/FERQo750) - Unique users who performed todo actions per day
- [Todo Deletion Rate](https://us.posthog.com/project/2/insights/zU2ypKI5) - Tracks deletion frequency (potential churn indicator)
- [Task Completion vs Uncomplete](https://us.posthog.com/project/2/insights/jVmV1LHX) - Compare completed vs uncompleted task behaviors

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.

## Additional Features Enabled

- **Session Replay**: Automatically records user sessions for debugging and UX analysis
- **Error Tracking**: Captures unhandled exceptions via `capture_exceptions: true`
- **Reverse Proxy**: Routes PostHog requests through `/ingest` to improve tracking reliability
- **Automatic Pageviews**: Captures `$pageview` and `$pageleave` events automatically
