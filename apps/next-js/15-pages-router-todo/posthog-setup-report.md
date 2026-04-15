<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application.

**Changes made:**

- **`instrumentation-client.ts`** (new): Initializes `posthog-js` on the client side using Next.js 15.3+ instrumentation. Configured with a reverse proxy (`/ingest`), exception capture, and debug mode in development.
- **`next.config.ts`**: Added reverse proxy rewrites for `/ingest` → `https://us.i.posthog.com` to reduce ad-blocker interference. Added `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node`, configured with `flushAt: 1` and `flushInterval: 0` for immediate event flushing in short-lived API handlers.
- **`components/todos/todo-list.tsx`**: Added client-side `posthog.capture()` calls for all four todo actions. Passes `x-posthog-distinct-id` header to API routes for client/server identity correlation. Added `posthog.captureException()` in all error handlers.
- **`pages/api/todos/index.ts`**: Server-side capture of `todo created` on POST success, reading `x-posthog-distinct-id` from request headers.
- **`pages/api/todos/[id].ts`**: Server-side capture of `todo updated` (PATCH) and `todo deleted` (DELETE) on success.
- **`.env.local`**: Created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

| Event | Description | File |
|-------|-------------|------|
| `todo created` | User successfully creates a new todo | `components/todos/todo-list.tsx` |
| `todo completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo reopened` | User marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo created` | Server-side: todo persisted via POST /api/todos | `pages/api/todos/index.ts` |
| `todo updated` | Server-side: todo updated via PATCH /api/todos/[id] | `pages/api/todos/[id].ts` |
| `todo deleted` | Server-side: todo deleted via DELETE /api/todos/[id] | `pages/api/todos/[id].ts` |

## Next steps

To monitor user behavior, set up an **"Analytics basics"** dashboard in PostHog with these five insights:

1. **Todo creation rate** — Trend of `todo created` events over time. Shows how actively users are adding todos.
2. **Todo completion rate** — Trend of `todo completed` vs `todo created` over time. Your key engagement funnel metric.
3. **Task completion funnel** — Funnel: `todo created` → `todo completed`. Shows what percentage of created todos get finished.
4. **Churn signal: todo deleted without completing** — Trend of `todo deleted` events where the todo was never completed. High numbers may indicate users giving up.
5. **Task lifecycle breakdown** — Stacked bar chart of `todo created`, `todo completed`, `todo reopened`, and `todo deleted` to understand overall task lifecycle patterns.

You can create these at: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
