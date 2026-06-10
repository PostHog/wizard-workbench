<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application.

**Changes made:**

- **`instrumentation-client.ts`** (new): Initializes posthog-js on the client side using Next.js's instrumentation hook. Configured with a reverse proxy (`/ingest`), exception capture for error tracking, and debug mode in development.
- **`next.config.ts`**: Added reverse proxy rewrites so PostHog requests route through `/ingest/*`, improving reliability against ad blockers. Also added `skipTrailingSlashRedirect: true` as required by PostHog.
- **`lib/posthog-server.ts`** (new): A helper that creates a fresh `posthog-node` client per request with `flushAt: 1` and `flushInterval: 0` for immediate event flushing in API routes.
- **`components/todos/todo-list.tsx`**: Added client-side `posthog.capture()` calls for all four core user actions, plus `posthog.captureException()` in error handlers. The `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers are forwarded with each API call to correlate client and server events.
- **`pages/api/todos/index.ts`**: Server-side capture of `todo_created_server` on successful todo creation, reading the distinct ID from the forwarded header.
- **`pages/api/todos/[id].ts`**: Server-side capture of `todo_updated_server` and `todo_deleted_server` on successful PATCH and DELETE operations.
- **`.env.local`**: Created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

| Event | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully adds a new todo item via the form | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user checks off a todo, marking it as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user unchecks a completed todo, marking it as incomplete again | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created_server` | Server-side event fired when a new todo is successfully created via the POST /api/todos endpoint | `pages/api/todos/index.ts` |
| `todo_updated_server` | Server-side event fired when a todo is updated via the PATCH /api/todos/[id] endpoint | `pages/api/todos/[id].ts` |
| `todo_deleted_server` | Server-side event fired when a todo is deleted via the DELETE /api/todos/[id] endpoint | `pages/api/todos/[id].ts` |

## Next steps

Create the **"Analytics basics (wizard)"** dashboard in PostHog to monitor user behavior. Here are the recommended insights to build:

1. **Todo creation trend** — Trends chart of `todo_created` over time. Shows how actively users are adding tasks.
2. **Todo completion rate** — Trends chart of `todo_completed` vs `todo_created` in a formula (`A/B*100`) to track the completion funnel.
3. **Task lifecycle funnel** — Funnel with steps: `todo_created` → `todo_completed`. Shows the percentage of created tasks that get completed.
4. **Deletion rate** — Trends chart of `todo_deleted` over time. High deletion soon after creation can signal friction.
5. **Server vs client event correlation** — Trends chart of `todo_created` alongside `todo_created_server`. They should track closely; divergence indicates client-side drop-off or API errors.

- [Create a new dashboard](https://us.posthog.com/project/2/dashboard)
- [Create a new insight](https://us.posthog.com/project/2/insights/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
