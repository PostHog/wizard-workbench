# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 App Router todo application. The integration includes both client-side and server-side event tracking, with automatic error capture and reverse proxy configuration for improved data collection.

## Changes Made

### Core Setup Files

| File | Description |
|------|-------------|
| `instrumentation-client.ts` | Client-side PostHog initialization with exception tracking enabled |
| `lib/posthog-server.ts` | Server-side PostHog client for API route tracking |
| `next.config.ts` | Reverse proxy rewrites for PostHog ingestion |
| `.env` | Environment variables for PostHog configuration |

### Event Tracking Implementation

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `todo_created` | User created a new todo item (client-side) | `components/todos/todo-list.tsx` |
| `todo_completed` | User marked a todo item as completed (client-side) | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marked a completed todo item as incomplete (client-side) | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deleted a todo item (client-side) | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event when a todo is created via API | `app/api/todos/route.ts` |
| `server_todo_updated` | Server-side event when a todo is updated via API | `app/api/todos/[id]/route.ts` |
| `server_todo_deleted` | Server-side event when a todo is deleted via API | `app/api/todos/[id]/route.ts` |

### Error Tracking

Error capture has been added to all client-side operations using `posthog.captureException()` in the following handlers:
- `handleAddTodo`
- `handleToggleTodo`
- `handleDeleteTodo`

Automatic exception capture is also enabled globally via `capture_exceptions: true` in the PostHog initialization.

## Next steps

### Recommended Dashboard Insights

Create a dashboard named "Analytics basics" in PostHog with these insights based on your instrumented events:

1. **Todo Creation Funnel** - Track the conversion from page visit to todo creation using `todo_created`
2. **Task Completion Rate** - Monitor `todo_completed` vs `todo_uncompleted` events to understand user productivity
3. **Todo Lifecycle** - Funnel from `todo_created` -> `todo_completed` -> `todo_deleted`
4. **Error Rate Tracking** - Monitor exceptions captured to identify issues
5. **Daily Active Usage** - Track unique users performing any todo action

### Manual Dashboard Setup

Since the API key provided is for client SDK integration, you can create these dashboards manually:

1. Go to [PostHog Dashboards](https://us.posthog.com/dashboard)
2. Click "New dashboard" and name it "Analytics basics"
3. Add insights using the event names listed above

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.

## Configuration

Environment variables are stored in `.env`:
- `NEXT_PUBLIC_POSTHOG_KEY` - Your PostHog project API key
- `NEXT_PUBLIC_POSTHOG_HOST` - PostHog host URL

The reverse proxy configuration in `next.config.ts` routes `/ingest/*` requests through your Next.js server to PostHog, improving data collection reliability and avoiding ad blockers.
