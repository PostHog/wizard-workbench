# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js Pages Router project with PostHog analytics. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` (Next.js 15.3+ best practice)
- **Server-side tracking** using `posthog-node` for API route events
- **Reverse proxy configuration** via Next.js rewrites to improve tracking reliability
- **Error tracking** with `posthog.captureException()` for catching and reporting errors
- **Environment variable configuration** for secure API key management

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo item as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event when a todo is created via API | `pages/api/todos/index.ts` |
| `server_todo_updated` | Server-side event when a todo is updated via API | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server-side event when a todo is deleted via API | `pages/api/todos/[id].ts` |

## Files Created/Modified

| File | Change |
|------|--------|
| `instrumentation-client.ts` | Created - PostHog client-side initialization |
| `lib/posthog-server.ts` | Created - Server-side PostHog client singleton |
| `next.config.ts` | Modified - Added reverse proxy rewrites for `/ingest` |
| `.env.local` | Created/Modified - Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` |
| `components/todos/todo-list.tsx` | Modified - Added client-side event tracking |
| `pages/api/todos/index.ts` | Modified - Added server-side event tracking for todo creation |
| `pages/api/todos/[id].ts` | Modified - Added server-side event tracking for updates and deletes |

## Next steps

### Recommended Dashboard Insights

Once events start flowing, create the following insights in your PostHog dashboard:

1. **Todo Creation Funnel**: Track the user journey from page view to todo creation
2. **Task Completion Rate**: Monitor the ratio of todos completed vs created
3. **Active Users**: Track unique users interacting with the todo app
4. **Task Lifecycle**: Visualize the time from creation to completion
5. **Error Tracking**: Monitor exceptions captured during todo operations

### View Your Data

Visit your PostHog dashboard to see incoming events:
- [PostHog US Dashboard](https://us.posthog.com/)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Configuration Summary

- **PostHog Host**: `https://us.i.posthog.com`
- **API Proxy Path**: `/ingest` (configured in `next.config.ts`)
- **Environment Variables**:
  - `NEXT_PUBLIC_POSTHOG_KEY` - Your PostHog project API key
  - `NEXT_PUBLIC_POSTHOG_HOST` - PostHog host URL
