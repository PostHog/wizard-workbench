<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. Here's a summary of what was added:

- **`instrumentation-client.ts`** (new): Client-side PostHog initialization using the Next.js 15.3+ instrumentation hook. Enables automatic session replay, exception capture, and debug logging in development.
- **`lib/posthog-server.ts`** (new): Server-side PostHog singleton using `posthog-node`, shared across API routes with immediate flushing.
- **`next.config.ts`** (updated): Added PostHog reverse proxy rewrites (`/ingest/*`) and `skipTrailingSlashRedirect` to ensure reliable event delivery and ad-blocker resilience.
- **`components/todos/todo-list.tsx`** (updated): Added four client-side `posthog.capture()` calls covering the full todo lifecycle.
- **`pages/api/todos/index.ts`** (updated): Added server-side `todo_created` event on successful POST.
- **`pages/api/todos/[id].ts`** (updated): Added server-side `todo_updated` and `todo_deleted` events on successful PATCH and DELETE.

| Event | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: new todo persisted via API | `pages/api/todos/index.ts` |
| `todo_updated` | Server-side: todo updated via API | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server-side: todo deleted via API | `pages/api/todos/[id].ts` |

## Next steps

Create an "Analytics basics" dashboard in PostHog with the following insights to monitor user behavior:

1. **Todo creation trend** — Track `todo_created` over time to see engagement:
   [Open in PostHog](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"todo_created","type":"events","order":0}]})

2. **Todo completion rate** — Funnel from `todo_created` → `todo_completed`:
   [Open in PostHog](https://us.posthog.com/project/238460/insights/new#{"insight":"FUNNELS","events":[{"id":"todo_created","type":"events","order":0},{"id":"todo_completed","type":"events","order":1}]})

3. **Todo deletion rate** — Track `todo_deleted` as a churn/discard signal:
   [Open in PostHog](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"todo_deleted","type":"events","order":0}]})

4. **Active vs completed tasks** — Compare `todo_completed` vs `todo_uncompleted` over time:
   [Open in PostHog](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"todo_completed","type":"events","order":0},{"id":"todo_uncompleted","type":"events","order":1}]})

5. **All todo events breakdown** — Stacked view of all todo lifecycle events:
   [Open in PostHog](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"todo_created","type":"events","order":0},{"id":"todo_completed","type":"events","order":1},{"id":"todo_deleted","type":"events","order":2}]})

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
