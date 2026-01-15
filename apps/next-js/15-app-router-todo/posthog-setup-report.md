<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 App Router todo application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+)
- **Server-side tracking** using the `posthog-node` SDK for API route events
- **Reverse proxy configuration** in `next.config.ts` to improve tracking reliability and avoid ad blockers
- **Error tracking** with `posthog.captureException()` for catching and reporting errors
- **Environment variables** configured in `.env` for secure API key management

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `todo_created` | Fired when a user successfully creates a new todo item (client-side) | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user marks a completed todo item as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item (client-side) | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event fired when a todo is created via the API | `app/api/todos/route.ts` |
| `server_todo_updated` | Server-side event fired when a todo is updated via the API | `app/api/todos/[id]/route.ts` |
| `server_todo_deleted` | Server-side event fired when a todo is deleted via the API | `app/api/todos/[id]/route.ts` |

## Files Created/Modified

| File | Change Type | Description |
|------|-------------|-------------|
| `instrumentation-client.ts` | Created | PostHog client-side initialization |
| `lib/posthog-server.ts` | Created | Server-side PostHog client singleton |
| `.env` | Created | Environment variables for PostHog |
| `next.config.ts` | Modified | Added reverse proxy rewrites for PostHog |
| `components/todos/todo-list.tsx` | Modified | Added client-side event tracking |
| `app/api/todos/route.ts` | Modified | Added server-side event tracking for todo creation |
| `app/api/todos/[id]/route.ts` | Modified | Added server-side event tracking for update/delete |

## Next steps

To view your analytics, visit your PostHog dashboard:
- **PostHog Dashboard**: https://us.posthog.com

Recommended insights to create:
1. **Todo Funnel**: `todo_created` → `todo_completed` to track task completion rates
2. **Retention Analysis**: Track users who create todos and return to complete them
3. **Trends**: Monitor `todo_created`, `todo_completed`, `todo_deleted` over time
4. **User Paths**: Analyze common patterns in todo management

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
