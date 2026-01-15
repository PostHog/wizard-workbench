# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js Pages Router todo application. The integration includes both client-side and server-side event tracking, error tracking with exception capture, and a reverse proxy setup for improved ad-blocker resilience.

## Changes Made

### Configuration Files
- **instrumentation-client.ts**: Created client-side PostHog initialization with exception capturing and debug mode
- **next.config.ts**: Added rewrites for PostHog proxy (`/ingest/*` routes) and trailing slash redirect configuration
- **lib/posthog-server.ts**: Created server-side PostHog client for API route tracking
- **.env**: Added PostHog environment variables (`NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`)

### Event Tracking

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | User creates a new todo item - key conversion event indicating active usage | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed - engagement metric showing task completion | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo as incomplete - indicates reconsideration | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item - could indicate cleanup or abandonment | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side tracking when a todo is created via API | `pages/api/todos/index.ts` |
| `server_todo_updated` | Server-side tracking when a todo is updated via API | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server-side tracking when a todo is deleted via API | `pages/api/todos/[id].ts` |

### Error Tracking
- Exception capture enabled via `capture_exceptions: true` in instrumentation-client.ts
- Manual `posthog.captureException(error)` calls added to catch blocks in todo-list.tsx

## Next steps

To create dashboards and insights based on the events instrumented above, visit your PostHog project:

1. **Create a Dashboard**: Go to PostHog > Dashboards > New Dashboard > Name it "Analytics basics"

2. **Suggested Insights to Add**:
   - **Todo Creation Funnel**: Track `todo_created` events over time to measure user engagement
   - **Task Completion Rate**: Compare `todo_completed` vs `todo_created` to measure productivity
   - **Churn Indicator**: Track `todo_deleted` events, especially where `was_completed: false`
   - **Daily Active Users**: Unique users triggering any todo event
   - **Feature Adoption**: Track completion rates to understand how users engage with the app

3. **Access your PostHog Project**: https://us.i.posthog.com

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.

The skill includes:
- Example project code demonstrating best practices
- Documentation for Next.js Pages Router integration
- User identification patterns
- Error tracking guidelines
