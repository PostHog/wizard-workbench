# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js Pages Router todo application. The integration includes:

- **Client-side tracking** via `instrumentation-client.ts` for automatic pageview capture and exception tracking
- **Server-side tracking** via `posthog-node` for API route events
- **Reverse proxy** configuration in `next.config.ts` to avoid ad blockers
- **Environment variables** set up in `.env` for secure API key management

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | Tracks when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Tracks when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Tracks when a user marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Tracks when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `api_todo_created` | Server-side tracking when a todo is created via API | `pages/api/todos/index.ts` |
| `api_todo_updated` | Server-side tracking when a todo is updated via API | `pages/api/todos/[id].ts` |
| `api_todo_deleted` | Server-side tracking when a todo is deleted via API | `pages/api/todos/[id].ts` |
| `api_error` | Server-side tracking when an API error occurs | `pages/api/todos/index.ts`, `pages/api/todos/[id].ts` |

## Files Created/Modified

| File | Action | Purpose |
|------|--------|---------|
| `instrumentation-client.ts` | Created | Client-side PostHog initialization |
| `lib/posthog-server.ts` | Created | Server-side PostHog client singleton |
| `next.config.ts` | Modified | Added reverse proxy rewrites for PostHog |
| `.env` | Created | PostHog API key and host environment variables |
| `components/todos/todo-list.tsx` | Modified | Added client-side event tracking |
| `pages/api/todos/index.ts` | Modified | Added server-side event tracking |
| `pages/api/todos/[id].ts` | Modified | Added server-side event tracking |

## Next steps

We recommend creating the following insights in your PostHog dashboard to track user behavior:

### Suggested Dashboard: "Analytics basics"

1. **Todo Creation Funnel** - Track the flow from page visit to todo creation
   - Events: `$pageview` -> `todo_created`

2. **Todo Completion Rate** - Measure how many todos get completed vs created
   - Events: `todo_created` vs `todo_completed`

3. **Task Engagement Over Time** - Track daily/weekly todo activity
   - Events: `todo_created`, `todo_completed`, `todo_deleted` over time

4. **API Error Rate** - Monitor server-side errors
   - Events: `api_error` count over time

5. **User Activity Flow** - Understand user behavior patterns
   - Events: `todo_created` -> `todo_completed` -> `todo_deleted`

Create your dashboard at: https://us.posthog.com/project/settings

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
