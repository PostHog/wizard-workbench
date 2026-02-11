# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 Pages Router todo application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` for automatic pageviews, session replay, and exception capture
- **Server-side PostHog client** in `lib/posthog-server.ts` for API route event tracking
- **Reverse proxy configuration** in `next.config.ts` to improve tracking reliability and avoid ad blockers
- **Environment variables** configured in `.env.local` using Next.js naming conventions (`NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`)

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | User creates a new todo item (client-side) | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed (client-side) | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a todo item as incomplete (client-side) | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item (client-side) | `components/todos/todo-list.tsx` |
| `todo_created_server` | Server-side event when a todo is created via API | `pages/api/todos/index.ts` |
| `todo_updated_server` | Server-side event when a todo is updated via API | `pages/api/todos/[id].ts` |
| `todo_deleted_server` | Server-side event when a todo is deleted via API | `pages/api/todos/[id].ts` |

## Files Modified/Created

| File | Change Type | Description |
|------|-------------|-------------|
| `instrumentation-client.ts` | Created | PostHog client-side initialization |
| `lib/posthog-server.ts` | Created | Server-side PostHog client singleton |
| `next.config.ts` | Modified | Added reverse proxy rewrites for PostHog |
| `components/todos/todo-list.tsx` | Modified | Added client-side event tracking and error capture |
| `pages/api/todos/index.ts` | Modified | Added server-side event tracking for todo creation |
| `pages/api/todos/[id].ts` | Modified | Added server-side event tracking for todo updates and deletions |
| `.env.local` | Created | Environment variables for PostHog API key and host |

## Next steps

We've instrumented key user actions in your todo application. Here are some recommended next steps:

1. **Create a Dashboard**: Build an "Analytics basics" dashboard in PostHog with insights for:
   - Todo creation trends over time
   - Task completion funnel (created -> completed)
   - Task deletion rates
   - Active vs completed task ratio

2. **User Identification**: When you add authentication, use `posthog.identify()` to track users across sessions

3. **Feature Flags**: Use PostHog feature flags to A/B test new features

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
