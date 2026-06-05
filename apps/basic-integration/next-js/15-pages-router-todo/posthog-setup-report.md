<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application.

## What was set up

- **Client-side initialization** via `instrumentation-client.ts` using PostHog's recommended Next.js 15.3+ approach — no provider component required.
- **Reverse proxy rewrites** added to `next.config.ts` so all PostHog traffic routes through `/ingest`, improving ad-blocker resilience and keeping requests first-party.
- **Server-side PostHog client** created at `lib/posthog-server.ts` for tracking events from API routes.
- **Client-side event tracking** in `components/todos/todo-list.tsx` covering all four core user actions.
- **Server-side event tracking** in both API route handlers, with the client's distinct ID and session ID forwarded via request headers (`X-POSTHOG-DISTINCT-ID`, `X-POSTHOG-SESSION-ID`) for cross-domain correlation.
- **Error tracking** enabled via `capture_exceptions: true` in the init config, plus `posthog.captureException()` calls in client-side error catch blocks.
- **Environment variables** written to `.env.local` — never hardcoded in source files.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks an active todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | User marks a completed todo back to active | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item (client side) | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: new todo created via POST API | `pages/api/todos/index.ts` |
| `todo_updated` | Server-side: todo updated via PATCH API | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server-side: todo deleted via DELETE API | `pages/api/todos/[id].ts` |

## Next steps

A PostHog dashboard named **"Analytics basics (wizard)"** could not be created automatically because the current API key is missing the `dashboard:write` and `insight:write` scopes. You can create it manually in PostHog with the following suggested insights:

1. **Todo creation trend** — Trends insight on `todo_created` over time
2. **Task completion rate** — Trends formula: `todo_completed / todo_created * 100`
3. **Todo deletion trend** — Trends insight on `todo_deleted` over time
4. **Create → Complete funnel** — Funnel from `todo_created` → `todo_completed`
5. **Active vs completed todos** — Trends comparing `todo_completed` vs `todo_reopened`

Visit your [PostHog project dashboards](https://us.posthog.com/project/2/dashboards) to build these.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
