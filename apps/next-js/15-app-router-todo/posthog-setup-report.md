# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 15 App Router project with PostHog analytics. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the PostHog JavaScript SDK
- **Server-side tracking** via `lib/posthog-server.ts` using the PostHog Node SDK
- **Reverse proxy configuration** in `next.config.ts` to route analytics through `/ingest` endpoint
- **Environment variables** configured in `.env` for API key and host settings
- **Event tracking** for all major user actions (create, complete, delete todos)
- **Error tracking** with `posthog.captureException()` for client and server errors

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `todo_created` | Fired when a user creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todos_fetch_error` | Client-side error when fetching todos fails | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event fired when a todo is successfully created via API | `app/api/todos/route.ts` |
| `server_todo_updated` | Server-side event fired when a todo is updated via API | `app/api/todos/[id]/route.ts` |
| `server_todo_deleted` | Server-side event fired when a todo is deleted via API | `app/api/todos/[id]/route.ts` |
| `api_error` | Server-side event fired when an API error occurs | `app/api/todos/route.ts`, `app/api/todos/[id]/route.ts` |
| `api_validation_error` | Server-side event fired when API input validation fails | `app/api/todos/route.ts`, `app/api/todos/[id]/route.ts` |

## Files Created/Modified

| File | Action | Purpose |
|------|--------|---------|
| `.env` | Created | PostHog API key and host configuration |
| `instrumentation-client.ts` | Created | Client-side PostHog initialization |
| `lib/posthog-server.ts` | Created | Server-side PostHog client helper |
| `next.config.ts` | Modified | Added reverse proxy rewrites for PostHog |
| `components/todos/todo-list.tsx` | Modified | Added client-side event tracking |
| `app/api/todos/route.ts` | Modified | Added server-side event tracking |
| `app/api/todos/[id]/route.ts` | Modified | Added server-side event tracking |

## Next steps

We've configured your project to work with PostHog analytics. You can view your data and create custom insights in PostHog:

- **Dashboard**: [Analytics basics](https://us.posthog.com/project/2/dashboard/991016)

### Suggested insights to create

Based on the events implemented, consider creating these insights in PostHog:

1. **Todo Creation Funnel** - Track the flow from page view to todo creation
2. **Task Completion Rate** - Ratio of `todo_completed` to `todo_created` events
3. **User Engagement Trends** - Track `todo_created`, `todo_completed`, and `todo_deleted` over time
4. **Error Rate Monitoring** - Track `api_error` and `api_validation_error` events
5. **Task Lifecycle Analysis** - Time between creation and completion/deletion

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.
