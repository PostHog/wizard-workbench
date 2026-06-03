<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router todo application. Here is a summary of what was done:

- **Installed** `posthog-js` (client-side) and `posthog-node` (server-side) packages
- **Created** `instrumentation-client.ts` to initialize PostHog on the client using the Next.js 15.3+ recommended approach, with exception capture and a reverse proxy
- **Updated** `next.config.ts` with `/ingest` reverse proxy rewrites so PostHog events are less likely to be blocked by ad blockers
- **Created** `lib/posthog-server.ts` as a singleton helper for server-side PostHog tracking via `posthog-node`
- **Instrumented** `components/todos/todo-list.tsx` with three client-side capture calls (`todo_created`, `todo_completion_toggled`, `todo_deleted`), plus error tracking via `captureException` on fetch failures
- **Instrumented** `app/api/todos/route.ts` with a server-side `todo_created` event on successful POST
- **Instrumented** `app/api/todos/[id]/route.ts` with server-side `todo_updated` and `todo_deleted` events on successful PATCH/DELETE
- **Correlated** client and server events by passing `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers from the client to each API route, so all events for a session are linked to the same person in PostHog
- **Configured** environment variables (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) in `.env.local`

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User successfully creates a new todo (client-side) | `components/todos/todo-list.tsx` |
| `todo_completion_toggled` | User marks a todo as completed or uncompleted | `components/todos/todo-list.tsx` |
| `todo_deleted` | User successfully deletes a todo (client-side) | `components/todos/todo-list.tsx` |
| `todo_created` | A new todo was created via the API (server-side) | `app/api/todos/route.ts` |
| `todo_updated` | A todo was updated via the API (server-side) | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | A todo was deleted via the API (server-side) | `app/api/todos/[id]/route.ts` |

## Next steps

Visit your PostHog project to explore the captured events and build insights:

- [Events explorer](/events) — see live events as users interact with the app
- [Insights](/insights) — build trends, funnels, and retention charts for the events above. Suggested insights:
  - Trend of `todo_created` over time — see how many todos are being created daily
  - Funnel: `todo_created` → `todo_completion_toggled` (completed=true) — measure task completion rate
  - Trend of `todo_deleted` over time — monitor task abandonment
- [Dashboards](/dashboard) — combine your insights into an "Analytics basics" dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
