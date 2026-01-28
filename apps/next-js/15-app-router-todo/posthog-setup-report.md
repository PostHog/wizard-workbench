# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 App Router todo application. This integration includes:

- **Client-side analytics** using `posthog-js` initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+)
- **Server-side analytics** using `posthog-node` for API route error tracking
- **Reverse proxy configuration** in `next.config.ts` to improve tracking reliability and bypass ad blockers
- **Automatic exception capture** with `capture_exceptions: true` for error tracking
- **Environment-based debugging** that enables debug mode in development

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | User creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a todo item as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_create_failed` | Server-side: Failed to create a todo | `app/api/todos/route.ts` |
| `todo_update_failed` | Server-side: Failed to update a todo | `app/api/todos/[id]/route.ts` |
| `todo_delete_failed` | Server-side: Failed to delete a todo | `app/api/todos/[id]/route.ts` |

## Files Created/Modified

| File | Action | Purpose |
|------|--------|---------|
| `.env` | Created | PostHog API key and host configuration |
| `instrumentation-client.ts` | Created | Client-side PostHog initialization |
| `lib/posthog-server.ts` | Created | Server-side PostHog client |
| `next.config.ts` | Modified | Added reverse proxy rewrites |
| `components/todos/todo-list.tsx` | Modified | Added event capture for todo CRUD operations |
| `app/api/todos/route.ts` | Modified | Added server-side error tracking |
| `app/api/todos/[id]/route.ts` | Modified | Added server-side error tracking |

## Next steps

### Create a Dashboard

To get the most out of your PostHog integration, create a dashboard in PostHog with these recommended insights:

1. **Todo Creation Trend** - Track how many todos are being created over time
2. **Completion Rate Funnel** - `todo_created` -> `todo_completed` conversion funnel
3. **Task Lifecycle** - Distribution of todo states (created, completed, deleted)
4. **Error Rate Monitoring** - Track `todo_*_failed` events to monitor API health
5. **User Engagement** - Daily/weekly active users based on todo interactions

Visit your PostHog dashboard at: https://us.posthog.com

### Environment Variables

Make sure to add these environment variables to your production environment:

```bash
NEXT_PUBLIC_POSTHOG_KEY=your_production_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
