# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 15 App Router todo application with PostHog analytics. The integration includes client-side event tracking for all core user actions, automatic pageview capture, session recording, and error tracking via exception capture.

## Integration Summary

The following files were created or modified:

| File | Change |
|------|--------|
| `instrumentation-client.ts` | Created - PostHog client-side initialization using the recommended Next.js 15.3+ approach |
| `next.config.ts` | Modified - Added reverse proxy rewrites to route PostHog requests through `/ingest` |
| `components/todos/todo-list.tsx` | Modified - Added event tracking for todo CRUD operations with error capture |
| `.env` / `.env.local` | Already configured with PostHog API key and host |

## Events Instrumented

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://us.posthog.com/project/2/dashboard/1053466) - Main dashboard with all todo app metrics

### Insights
- [Todos Created Over Time](https://us.posthog.com/project/2/insights/VM6O8k00) - Daily count of new todos created by users
- [Task Completion Funnel](https://us.posthog.com/project/2/insights/awtTnRvl) - Conversion funnel from todo creation to completion
- [Todo Actions Breakdown](https://us.posthog.com/project/2/insights/6Z5qT8sx) - Comparison of all todo actions (created, completed, uncompleted, deleted)
- [Todos Deleted (Churn Indicator)](https://us.posthog.com/project/2/insights/SGJ2h87T) - Daily count of deleted todos - high deletion rates may indicate user frustration
- [Task Completion Rate](https://us.posthog.com/project/2/insights/hK3prARA) - Ratio of completed todos to created todos

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.
