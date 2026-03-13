<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 App Router todo application. Here's a summary of what was set up:

- **`instrumentation-client.ts`** — Created client-side PostHog initialization using the Next.js 15.3+ `instrumentation-client.ts` pattern. Includes automatic exception capture and a reverse proxy via `/ingest`.
- **`next.config.ts`** — Added PostHog reverse proxy rewrites (`/ingest/*`) and `skipTrailingSlashRedirect: true` to route analytics traffic through your own domain, improving ad-blocker resistance.
- **`lib/posthog-server.ts`** — Created a singleton server-side PostHog client using `posthog-node` for use in API routes.
- **`components/todos/todo-list.tsx`** — Added four client-side capture events for key user actions, plus `captureException` for error tracking.
- **`app/api/todos/route.ts`** — Added server-side `todo_created` capture on the POST endpoint.
- **`app/api/todos/[id]/route.ts`** — Added server-side `todo_updated` and `todo_deleted` captures on PATCH and DELETE endpoints.
- **`.env.local`** — Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User successfully created a new todo (client) | `components/todos/todo-list.tsx` |
| `todo_completed` | User marked a todo as completed (client) | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marked a completed todo as incomplete (client) | `components/todos/todo-list.tsx` |
| `todo_deleted` | User successfully deleted a todo (client) | `components/todos/todo-list.tsx` |
| `todo_created` | Server confirmed new todo creation via POST API (server) | `app/api/todos/route.ts` |
| `todo_updated` | Server confirmed todo update via PATCH API (server) | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server confirmed todo deletion via DELETE API (server) | `app/api/todos/[id]/route.ts` |

## Next steps

To visualize user behavior, create an **"Analytics basics"** dashboard in PostHog with these suggested insights:

1. **Todo Creation Rate** — Trend of `todo_created` events over time to track engagement
2. **Todo Completion Funnel** — Funnel from `todo_created` → `todo_completed` to measure task completion rate
3. **Todo Deletion Rate** — Trend of `todo_deleted` events to understand churn/abandonment
4. **Completed vs Uncompleted Toggles** — Breakdown of `todo_completed` vs `todo_uncompleted` to see how often users change their minds
5. **Active Users** — Unique users (by distinct ID) performing any todo action per day/week

You can create this dashboard at [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
