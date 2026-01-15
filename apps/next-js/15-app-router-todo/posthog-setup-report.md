# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 15 App Router project with PostHog analytics. The integration includes client-side event tracking for all todo actions, automatic pageview capture, session replay, and error tracking. A reverse proxy has been configured through Next.js rewrites to ensure reliable event delivery even with ad blockers.

## Files Modified

| File | Changes |
|------|---------|
| `instrumentation-client.ts` | Created - PostHog client initialization with error tracking enabled |
| `next.config.ts` | Modified - Added reverse proxy rewrites for PostHog ingestion |
| `components/todos/todo-list.tsx` | Modified - Added posthog import and event capture calls |
| `.env` / `.env.local` | Verified - Environment variables already configured |

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | User creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo item as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://us.posthog.com/project/2/dashboard/1055607) - Main analytics dashboard with all insights

### Insights
- [Todo Activity Over Time](https://us.posthog.com/project/2/insights/h5HMi29L) - Trend of todo actions over the last 30 days
- [Todo Completion Funnel](https://us.posthog.com/project/2/insights/AxCuAqlU) - Conversion funnel from todo creation to completion
- [Todo Deletion Rate (Churn)](https://us.posthog.com/project/2/insights/eaYe1KAR) - Track task abandonment patterns
- [Daily Active Users](https://us.posthog.com/project/2/insights/AwJmPpZ9) - Unique users performing todo actions per day
- [Todo Actions Breakdown](https://us.posthog.com/project/2/insights/U3osK6QX) - Distribution of all todo actions

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.
