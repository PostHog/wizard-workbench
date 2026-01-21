# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 App Router Todo application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the recommended Next.js 15.3+ approach
- **Server-side tracking** via `posthog-node` SDK for API route events
- **Reverse proxy configuration** in `next.config.ts` to improve tracking reliability and bypass ad blockers
- **Environment variables** configured in `.env` for secure API key management
- **Exception capture** enabled for automatic error tracking

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `todo_created` | User creates a new todo item (client-side) | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed (client-side) | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo item as incomplete (client-side) | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item (client-side) | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event when a todo is successfully created via API | `app/api/todos/route.ts` |
| `server_todo_updated` | Server-side event when a todo is successfully updated via API | `app/api/todos/[id]/route.ts` |
| `server_todo_deleted` | Server-side event when a todo is successfully deleted via API | `app/api/todos/[id]/route.ts` |

## Files Created/Modified

| File | Action | Purpose |
|------|--------|---------|
| `instrumentation-client.ts` | Created | Client-side PostHog initialization |
| `lib/posthog-server.ts` | Created | Server-side PostHog client singleton |
| `.env` | Created | Environment variables for PostHog configuration |
| `next.config.ts` | Modified | Added reverse proxy rewrites for PostHog |
| `components/todos/todo-list.tsx` | Modified | Added client-side event tracking |
| `app/api/todos/route.ts` | Modified | Added server-side event tracking for todo creation |
| `app/api/todos/[id]/route.ts` | Modified | Added server-side event tracking for todo updates and deletions |

## Next steps

### Create your dashboard

To create an "Analytics basics" dashboard in PostHog with insights based on the implemented events, you can:

1. Go to your PostHog project at https://us.posthog.com
2. Create a new dashboard named "Analytics basics"
3. Add the following suggested insights:

**Suggested Insights:**

1. **Todo Creation Funnel** - Track how users progress from viewing the app to creating todos
   - Events: `$pageview` → `todo_created`

2. **Task Completion Rate** - Measure how many created todos get completed
   - Events: `todo_created` → `todo_completed`

3. **Daily Active Usage** - Track daily todo operations
   - Events: `todo_created`, `todo_completed`, `todo_deleted` (grouped by day)

4. **Server vs Client Events Comparison** - Verify event correlation
   - Events: `todo_created` vs `server_todo_created`

5. **Task Lifecycle** - Understand the complete todo journey
   - Events: `todo_created` → `todo_completed` → `todo_deleted`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Configuration Reference

- **PostHog Host**: https://us.i.posthog.com
- **Reverse Proxy**: `/ingest/*` routes to PostHog
- **Auto-captured**: Pageviews, page leaves, exceptions
- **Debug Mode**: Enabled in development environment
