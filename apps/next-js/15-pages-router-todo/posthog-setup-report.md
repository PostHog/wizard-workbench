# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js Pages Router todo application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the recommended Next.js 15.3+ pattern
- **Reverse proxy configuration** in `next.config.ts` to route PostHog requests through `/ingest` for improved reliability and ad-blocker avoidance
- **Server-side PostHog client** in `lib/posthog-server.ts` for tracking API route events
- **Environment variables** configured in `.env` for secure API key management
- **Client-side event tracking** for user interactions with todos
- **Server-side event tracking** for API operations with distinct ID correlation support

## Event Tracking Summary

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | User creates a new todo item with title and optional description | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo item as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event when a todo is successfully created via API | `pages/api/todos/index.ts` |
| `server_todo_updated` | Server-side event when a todo is successfully updated via API | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server-side event when a todo is successfully deleted via API | `pages/api/todos/[id].ts` |

## Files Created/Modified

| File | Action | Purpose |
|------|--------|---------|
| `instrumentation-client.ts` | Created | Client-side PostHog initialization |
| `next.config.ts` | Modified | Added reverse proxy rewrites for PostHog |
| `lib/posthog-server.ts` | Created | Server-side PostHog client helper |
| `.env` | Created | Environment variables for PostHog API key and host |
| `components/todos/todo-list.tsx` | Modified | Added client-side event tracking |
| `pages/api/todos/index.ts` | Modified | Added server-side event tracking for create |
| `pages/api/todos/[id].ts` | Modified | Added server-side event tracking for update/delete |

## Next steps

Once you start using the application and generating events, you can create insights and dashboards in PostHog to monitor:

1. **Todo Creation Funnel**: Track how many users create todos and their completion rate
2. **Task Completion Rate**: Monitor the ratio of completed vs uncompleted todos
3. **User Engagement**: Analyze daily/weekly todo creation and completion trends
4. **Churn Indicators**: Identify users who delete todos without completing them

Visit your PostHog dashboard at https://us.posthog.com to:
- View incoming events in the Activity tab
- Create custom insights based on the events above
- Build dashboards to track key metrics

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.
