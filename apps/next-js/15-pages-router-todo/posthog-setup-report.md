# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js Pages Router todo application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the recommended Next.js 15.3+ pattern
- **Server-side tracking** with `posthog-node` for API route analytics
- **Reverse proxy setup** through Next.js rewrites for better reliability and ad-blocker avoidance
- **Comprehensive event tracking** for all todo CRUD operations on both client and server
- **Error tracking** with `posthog.captureException()` for all client-side failures

## Events Added

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | User created a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marked a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marked a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deleted a todo item | `components/todos/todo-list.tsx` |
| `todo_create_failed` | Failed to create a todo item due to an error | `components/todos/todo-list.tsx` |
| `todo_update_failed` | Failed to update a todo item due to an error | `components/todos/todo-list.tsx` |
| `todo_delete_failed` | Failed to delete a todo item due to an error | `components/todos/todo-list.tsx` |
| `todo_fetch_failed` | Failed to fetch todos from the API | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event when a todo is created via API | `pages/api/todos/index.ts` |
| `server_todo_create_failed` | Server-side event when todo creation fails | `pages/api/todos/index.ts` |
| `server_todo_updated` | Server-side event when a todo is updated via API | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server-side event when a todo is deleted via API | `pages/api/todos/[id].ts` |

## Files Created/Modified

| File | Type | Description |
|------|------|-------------|
| `.env.local` | Created | PostHog environment variables |
| `instrumentation-client.ts` | Created | Client-side PostHog initialization |
| `lib/posthog-server.ts` | Created | Server-side PostHog client helper |
| `next.config.ts` | Modified | Added reverse proxy rewrites |
| `components/todos/todo-list.tsx` | Modified | Added client-side event capture |
| `pages/api/todos/index.ts` | Modified | Added server-side event capture |
| `pages/api/todos/[id].ts` | Modified | Added server-side event capture |

## Next steps

### Create a Dashboard

To visualize your todo app analytics, create a dashboard in PostHog with these recommended insights:

1. **Todo Creation Trend** - Track `todo_created` events over time
2. **Task Completion Funnel** - Funnel from `todo_created` to `todo_completed`
3. **Completion Rate** - Ratio of `todo_completed` to `todo_created`
4. **Todo Deletion Rate** - Track `todo_deleted` events over time
5. **Error Tracking** - Monitor `todo_create_failed`, `todo_update_failed`, `todo_delete_failed` events

Visit your PostHog dashboard to create these insights: https://us.i.posthog.com

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.
