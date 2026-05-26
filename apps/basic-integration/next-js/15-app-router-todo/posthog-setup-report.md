<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. PostHog is now initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to reduce ad-blocker interference. A shared server-side client in `lib/posthog-server.ts` powers event capture from API routes. Environment variables are stored in `.env.local`.

Client-side events are tracked in `components/todos/todo-list.tsx` on every successful todo action, with `posthog.captureException()` wired into the catch blocks for error tracking. Server-side events are captured in both API route handlers (`app/api/todos/route.ts` and `app/api/todos/[id]/route.ts`) using `posthog-node`.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo item as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: new todo created via API route | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: todo updated via API route | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side: todo deleted via API route | `app/api/todos/[id]/route.ts` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Todo creations over time** — trends chart for `todo_created` over the last 30 days
2. **Todo completion rate** — trends chart comparing `todo_completed` vs `todo_created` to see what fraction of todos get done
3. **Todo deletions over time** — trends chart for `todo_deleted`
4. **Todo completion funnel** — funnel from `todo_created` → `todo_completed` to measure conversion
5. **All todo actions** — stacked trends chart with `todo_created`, `todo_completed`, `todo_uncompleted`, and `todo_deleted` for an activity overview

Build these insights in your [PostHog project dashboard](/dashboard).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
