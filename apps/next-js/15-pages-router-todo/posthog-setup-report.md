# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js Pages Router todo application with PostHog analytics. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` for Next.js 15.3+ compatibility
- **Reverse proxy configuration** in `next.config.ts` to improve tracking reliability
- **Server-side PostHog client** for API route event tracking
- **Client-side event tracking** for user interactions (create, complete, delete todos)
- **Server-side event tracking** for API operations with error tracking
- **Exception capture** for error monitoring

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | Tracks when a user creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Tracks when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Tracks when a user marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Tracks when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event when a todo is successfully created via API | `pages/api/todos/index.ts` |
| `server_todo_updated` | Server-side event when a todo is successfully updated via API | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server-side event when a todo is successfully deleted via API | `pages/api/todos/[id].ts` |
| `api_error` | Tracks API errors for monitoring and debugging | `pages/api/todos/index.ts`, `pages/api/todos/[id].ts` |

## Files Created/Modified

| File | Change Type | Description |
|------|-------------|-------------|
| `.env` | Created | Environment variables for PostHog API key and host |
| `instrumentation-client.ts` | Created | Client-side PostHog initialization |
| `lib/posthog-server.ts` | Created | Server-side PostHog client singleton |
| `next.config.ts` | Modified | Added reverse proxy rewrites for PostHog |
| `components/todos/todo-list.tsx` | Modified | Added client-side event tracking |
| `pages/api/todos/index.ts` | Modified | Added server-side tracking for POST operations |
| `pages/api/todos/[id].ts` | Modified | Added server-side tracking for PATCH/DELETE operations |

## Next steps

Once your application is running and generating events, create a dashboard in PostHog with the following recommended insights:

1. **Todo Creation Funnel**: Track the conversion from page view to todo creation
2. **Task Completion Rate**: Measure the ratio of completed vs uncompleted todos
3. **Todo Lifecycle**: Track todos from creation through completion or deletion
4. **API Error Rate**: Monitor `api_error` events for reliability tracking
5. **User Engagement**: Track total user actions (creates, completes, deletes) over time

To create these insights:
1. Go to your PostHog dashboard: https://us.posthog.com
2. Navigate to **Insights** > **New insight**
3. Use the event names listed above to build your analytics

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Environment Variables

Make sure to set these environment variables in your deployment environment:

```
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```
