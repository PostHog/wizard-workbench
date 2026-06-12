<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router todo application. Here's what was set up:

- **`instrumentation-client.ts`** — Initializes PostHog on the client side using `posthog-js`. Includes error tracking (`capture_exceptions: true`) and a reverse proxy configuration for `/ingest/*`.
- **`lib/posthog-server.ts`** — A singleton PostHog Node.js client (`posthog-node`) used in API routes for server-side event capture.
- **`next.config.ts`** — Updated to add rewrites that proxy PostHog requests through `/ingest/*`, improving ad-blocker resilience.
- **`.env.local`** — Created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` set to the project values.
- **`components/todos/todo-list.tsx`** — Added client-side event capture for all todo actions, plus `captureException` in each error handler. The PostHog distinct ID is forwarded to API calls via the `x-posthog-distinct-id` header for client/server correlation.
- **`pages/api/todos/index.ts`** — Added server-side capture for `todo_created` via the POST route.
- **`pages/api/todos/[id].ts`** — Added server-side capture for `todo_updated` and `todo_deleted` via the PATCH and DELETE routes.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | Fired on the client when a new todo is successfully created | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired on the client when a todo is marked as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired on the client when a todo is unchecked (marked incomplete) | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired on the client when a todo is successfully deleted | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side event fired when a todo is created via the POST API route | `pages/api/todos/index.ts` |
| `todo_updated` | Server-side event fired when a todo is updated via the PATCH API route | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server-side event fired when a todo is deleted via the DELETE API route | `pages/api/todos/[id].ts` |

## Next steps

To complete your PostHog setup, create a dashboard named **"Analytics basics (wizard)"** with the following suggested insights:

- **Todo creation trend** — Trend of `todo_created` over time to track app usage growth.
- **Todo completion rate** — Ratio of `todo_completed` to `todo_created` to measure user follow-through.
- **Todo deletion trend** — Trend of `todo_deleted` to understand discard behavior.
- **Active vs completed ratio** — Compare `todo_completed` vs `todo_uncompleted` to measure task management patterns.
- **API errors** — Track any captured exceptions to monitor app stability.

Use these links to get started:

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard)
- [Create a new insight](https://us.posthog.com/project/2/insights/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
