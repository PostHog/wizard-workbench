# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js Pages Router todo application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` (Next.js 15.3+ recommended approach)
- **Server-side tracking** via `posthog-node` for API route error tracking
- **Reverse proxy configuration** in `next.config.ts` to bypass ad blockers
- **Environment variables** in `.env.local` for secure API key management
- **Event tracking** for core todo operations (create, complete, delete)
- **Error tracking** with `posthog.captureException()` for client-side errors and server-side error events

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo item as active/incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_create_failed` | Server-side error when creating a todo | `pages/api/todos/index.ts` |
| `todo_update_failed` | Server-side error when updating a todo | `pages/api/todos/[id].ts` |
| `todo_delete_failed` | Server-side error when deleting a todo | `pages/api/todos/[id].ts` |

## Files Created/Modified

| File | Change Type | Description |
|------|-------------|-------------|
| `instrumentation-client.ts` | Created | PostHog client initialization for Next.js 15.3+ |
| `lib/posthog-server.ts` | Created | Server-side PostHog client for API routes |
| `next.config.ts` | Modified | Added reverse proxy rewrites for PostHog |
| `.env.local` | Created | Environment variables for PostHog API key and host |
| `components/todos/todo-list.tsx` | Modified | Added client-side event tracking |
| `pages/api/todos/index.ts` | Modified | Added server-side error tracking |
| `pages/api/todos/[id].ts` | Modified | Added server-side error tracking |

## Next steps

We recommend creating an "Analytics basics" dashboard in PostHog with the following insights:

1. **Todo Completion Funnel**: Track the journey from `todo_created` → `todo_completed`
2. **Active Users**: Track unique users creating and completing todos over time
3. **Todo Activity Over Time**: Trend chart showing `todo_created`, `todo_completed`, and `todo_deleted` events
4. **Completion Rate**: Ratio of `todo_completed` to `todo_created` events
5. **Error Monitoring**: Track `todo_create_failed`, `todo_update_failed`, and `todo_delete_failed` events

To create these insights, visit your PostHog dashboard:
- **Dashboard**: https://us.posthog.com/project/insights

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Environment Variables

Make sure these environment variables are set in your deployment environment:

```bash
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```
