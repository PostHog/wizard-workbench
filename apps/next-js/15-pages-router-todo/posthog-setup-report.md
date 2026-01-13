# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 15 Pages Router todo application with PostHog analytics. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+)
- **Server-side PostHog client** for potential API route tracking
- **Reverse proxy configuration** through Next.js rewrites to avoid ad blockers
- **Environment variables** for secure API key management
- **Comprehensive event tracking** for all todo CRUD operations
- **Error tracking** with `posthog.captureException()` for all error scenarios
- **Automatic exception capture** enabled via `capture_exceptions: true`

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo item as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_create_failed` | Error occurred when attempting to create a todo | `components/todos/todo-list.tsx` |
| `todo_update_failed` | Error occurred when attempting to update a todo | `components/todos/todo-list.tsx` |
| `todo_delete_failed` | Error occurred when attempting to delete a todo | `components/todos/todo-list.tsx` |
| `todos_fetch_failed` | Error occurred when loading the todos list | `components/todos/todo-list.tsx` |
| `about_page_viewed` | User navigates to the about page (top of awareness funnel) | `pages/about.tsx` |
| `todo_form_submitted` | User submits the todo form (captures submission attempt before API call) | `components/todos/todo-form.tsx` |

## Files Created/Modified

| File | Action | Purpose |
|------|--------|---------|
| `.env` | Created | Environment variables for PostHog API key and host |
| `instrumentation-client.ts` | Created | Client-side PostHog initialization |
| `lib/posthog-server.ts` | Created | Server-side PostHog client for API routes |
| `next.config.ts` | Modified | Added reverse proxy rewrites for PostHog |
| `components/todos/todo-list.tsx` | Modified | Added event tracking for CRUD operations |
| `components/todos/todo-form.tsx` | Modified | Added form submission tracking |
| `pages/about.tsx` | Modified | Added page view tracking |

## Next steps

We recommend creating the following insights and dashboard in PostHog to monitor user behavior:

### Recommended Dashboard: "Todo App Analytics"

Create a new dashboard in PostHog with these insights:

1. **Todo Creation Funnel**
   - Type: Funnel
   - Steps: `todo_form_submitted` → `todo_created`
   - Purpose: Track conversion from form submission to successful todo creation

2. **Todo Completion Rate**
   - Type: Trends
   - Events: `todo_completed`, `todo_uncompleted`
   - Purpose: Monitor how often users complete vs uncomplete todos

3. **Todo Lifecycle**
   - Type: Trends
   - Events: `todo_created`, `todo_completed`, `todo_deleted`
   - Purpose: Track the full lifecycle of todos over time

4. **Error Monitoring**
   - Type: Trends
   - Events: `todo_create_failed`, `todo_update_failed`, `todo_delete_failed`, `todos_fetch_failed`
   - Purpose: Monitor error rates and identify issues

5. **User Engagement**
   - Type: Trends
   - Events: `about_page_viewed`, `todo_form_submitted`
   - Purpose: Track user engagement with the app

### Quick Links

- [PostHog Dashboard](https://us.posthog.com/dashboard) - Create your dashboards here
- [PostHog Events](https://us.posthog.com/events) - View all captured events
- [PostHog Insights](https://us.posthog.com/insights) - Create new insights

## Configuration Details

- **PostHog Host**: `https://us.i.posthog.com`
- **Reverse Proxy**: Configured at `/ingest` path
- **Debug Mode**: Enabled in development environment
- **Exception Capture**: Automatic capture enabled
