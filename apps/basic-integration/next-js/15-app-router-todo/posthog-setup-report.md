<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog on the client side using Next.js 15's `instrumentation-client` convention. Configured with a reverse proxy (`/ingest`), error tracking (`capture_exceptions: true`), and debug mode in development.
- **`next.config.ts`** (updated): Added reverse proxy rewrites so PostHog requests route through `/ingest` instead of directly to PostHog servers, improving reliability and reducing ad-blocker interference.
- **`lib/posthog-server.ts`** (new): Server-side PostHog client singleton using `posthog-node`, configured for immediate flushing (`flushAt: 1`, `flushInterval: 0`) suitable for Next.js API routes.
- **`.env.local`** (new): PostHog project token and host stored as environment variables.
- **`components/todos/todo-list.tsx`** (updated): Four client-side events added to the todo action handlers, plus `captureException` on errors.
- **`app/api/todos/route.ts`** (updated): Server-side `todo_created` event captured on successful POST.
- **`app/api/todos/[id]/route.ts`** (updated): Server-side `todo_updated` and `todo_deleted` events captured on successful PATCH and DELETE.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User submits the form to create a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks an active todo item as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | User unchecks a completed todo, marking it active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: POST /api/todos succeeds and a new todo is persisted | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: PATCH /api/todos/[id] succeeds and a todo is updated | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side: DELETE /api/todos/[id] succeeds and a todo is removed | `app/api/todos/[id]/route.ts` |

## Next steps

To monitor user behavior with these events, create an "Analytics basics" dashboard in PostHog with insights like:

- **Todo creation trend** — Trends chart for `todo_created` over time
- **Todo completion rate** — Funnel from `todo_created` → `todo_completed`
- **Deletion rate** — Trends chart for `todo_deleted` over time
- **Reopen rate** — Trends chart for `todo_reopened` over time
- **Task completion vs deletion** — Side-by-side trends of `todo_completed` and `todo_deleted`

You can create this dashboard at [/dashboard](https://us.posthog.com/project/2/dashboard).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
