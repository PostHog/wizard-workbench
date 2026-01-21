# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 15 Pages Router project with PostHog analytics. This integration includes:

- **Client-side initialization** using `instrumentation-client.ts` (the recommended approach for Next.js 15.3+)
- **Server-side tracking** via `posthog-node` for API route events
- **Reverse proxy configuration** in `next.config.ts` to improve reliability and avoid tracking blockers
- **Error tracking** with `posthog.captureException()` on client-side errors
- **Automatic pageviews and session replay** enabled via the `defaults: '2025-05-24'` configuration

## Events Implemented

| Event Name | Description | File Location |
|------------|-------------|---------------|
| `todo_created` | User creates a new todo item (client-side) | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed (client-side) | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo as incomplete (client-side) | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item (client-side) | `components/todos/todo-list.tsx` |
| `todo_create_api` | Todo successfully created via API (server-side) | `pages/api/todos/index.ts` |
| `todo_update_api` | Todo successfully updated via API (server-side) | `pages/api/todos/[id].ts` |
| `todo_delete_api` | Todo successfully deleted via API (server-side) | `pages/api/todos/[id].ts` |
| `api_error` | An error occurred in the API (server-side) | `pages/api/todos/index.ts`, `pages/api/todos/[id].ts` |

## Files Created/Modified

| File | Change Type | Description |
|------|-------------|-------------|
| `.env.local` | Created | PostHog environment variables |
| `instrumentation-client.ts` | Created | Client-side PostHog initialization |
| `lib/posthog-server.ts` | Created | Server-side PostHog client singleton |
| `next.config.ts` | Modified | Added reverse proxy rewrites for PostHog |
| `components/todos/todo-list.tsx` | Modified | Added client-side event tracking |
| `pages/api/todos/index.ts` | Modified | Added server-side event tracking |
| `pages/api/todos/[id].ts` | Modified | Added server-side event tracking |

## Next steps

### Create a Dashboard

To create the "Analytics basics" dashboard in PostHog:

1. Go to your [PostHog project](https://us.posthog.com)
2. Navigate to **Dashboards** > **New dashboard**
3. Name it "Analytics basics"
4. Add the following insights:

**Recommended Insights:**

1. **Todo Creation Funnel**
   - Type: Funnel
   - Steps: `$pageview` (homepage) -> `todo_created`
   - Shows: Conversion rate from page visit to creating a todo

2. **Task Completion Rate**
   - Type: Trends
   - Events: `todo_completed` vs `todo_created`
   - Shows: Ratio of todos completed vs created over time

3. **User Engagement**
   - Type: Trends
   - Events: `todo_created`, `todo_completed`, `todo_deleted`
   - Shows: Overall user activity with todos

4. **API Errors Over Time**
   - Type: Trends
   - Event: `api_error`
   - Breakdown by: `error_type`
   - Shows: API reliability monitoring

5. **Todo Lifecycle**
   - Type: Retention
   - Event: `todo_created`
   - Returning event: `todo_completed`
   - Shows: How long it takes users to complete todos

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Environment Variables

Make sure the following environment variables are set in your production environment:

```bash
NEXT_PUBLIC_POSTHOG_KEY=<your-posthog-project-api-key>
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```
