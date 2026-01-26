# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 App Router todo application. The integration includes:

- **Client-side tracking** via `instrumentation-client.ts` using the modern Next.js 15.3+ approach
- **Server-side tracking** via `posthog-node` SDK for API routes
- **Reverse proxy** configuration to improve tracking reliability and avoid ad blockers
- **Error tracking** with automatic exception capture on client-side and error event tracking on server-side

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `todo created` | User successfully created a new todo item (client-side) | `components/todos/todo-list.tsx` |
| `todo completed` | User marked a todo item as completed | `components/todos/todo-list.tsx` |
| `todo uncompleted` | User marked a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo deleted` | User deleted a todo item (client-side) | `components/todos/todo-list.tsx` |
| `todo form submitted` | User submitted the todo creation form | `components/todos/todo-form.tsx` |
| `server todo created` | Server-side event when a todo is successfully created via API | `app/api/todos/route.ts` |
| `server todo updated` | Server-side event when a todo is successfully updated via API | `app/api/todos/[id]/route.ts` |
| `server todo deleted` | Server-side event when a todo is successfully deleted via API | `app/api/todos/[id]/route.ts` |
| `api error` | Server-side event when an API error occurs | `app/api/todos/route.ts`, `app/api/todos/[id]/route.ts` |

## Files Created/Modified

| File | Type | Purpose |
|------|------|---------|
| `instrumentation-client.ts` | Created | PostHog client-side initialization |
| `lib/posthog-server.ts` | Created | PostHog server-side client singleton |
| `.env` | Created | Environment variables for PostHog API key and host |
| `next.config.ts` | Modified | Added rewrites for reverse proxy |
| `components/todos/todo-list.tsx` | Modified | Added client-side event tracking |
| `components/todos/todo-form.tsx` | Modified | Added form submission tracking |
| `app/api/todos/route.ts` | Modified | Added server-side event tracking |
| `app/api/todos/[id]/route.ts` | Modified | Added server-side event tracking |

## Next steps

### Create a Dashboard in PostHog

Navigate to your PostHog project and create a new dashboard named "Analytics basics" with the following insights:

1. **Todo Creation Funnel**: A funnel showing `todo form submitted` -> `todo created` -> `server todo created`
2. **Todo Completion Rate**: Trend showing `todo completed` events over time
3. **Todo Activity Overview**: Bar chart comparing `todo created`, `todo completed`, and `todo deleted` events
4. **API Error Monitoring**: Trend chart tracking `api error` events to monitor system health
5. **Server-side Operations**: Stacked area chart showing `server todo created`, `server todo updated`, and `server todo deleted`

### Recommended Insights URLs (create these in PostHog)

- Dashboard: `https://us.posthog.com/project/YOUR_PROJECT_ID/dashboard/new`
- Insights: `https://us.posthog.com/project/YOUR_PROJECT_ID/insights/new`

## Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Configuration Details

Your PostHog integration is configured with:

- **API Key**: Set via `NEXT_PUBLIC_POSTHOG_KEY` environment variable
- **Host**: Set via `NEXT_PUBLIC_POSTHOG_HOST` environment variable
- **Reverse Proxy**: Requests routed through `/ingest/*` to avoid ad blockers
- **Exception Capture**: Automatic unhandled exception tracking enabled
- **Debug Mode**: Enabled in development environment
