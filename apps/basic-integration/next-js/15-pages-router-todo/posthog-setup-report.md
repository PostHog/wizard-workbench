<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo app. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes posthog-js using Next.js 15.3+ instrumentation, routing events through the `/ingest` reverse proxy with exception capture enabled.
- **`next.config.ts`** (updated): Added reverse proxy rewrites so all PostHog requests route through `/ingest` instead of directly to PostHog servers (improves ad-blocker resilience), plus `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node` for capturing events from API routes.
- **`.env.local`** (new): `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` set for the project.
- **`components/todos/todo-list.tsx`** (updated): Client-side capture calls added for all core todo actions.
- **`pages/api/todos/index.ts`** (updated): Server-side capture for todo creation.
- **`pages/api/todos/[id].ts`** (updated): Server-side capture for todo updates and deletions.

| Event | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully adds a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event fired when a new todo is created via the API | `pages/api/todos/index.ts` |
| `server_todo_updated` | Server-side event fired when a todo is updated via the API | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server-side event fired when a todo is deleted via the API | `pages/api/todos/[id].ts` |

## Next steps

Create a dashboard to monitor user behavior with these events. Here are the recommended insights to build:

1. **Todo creation trend** — `todo_created` over time (Trends insight) — understand how often users add new tasks.
2. **Task completion rate** — `todo_completed` vs `todo_created` (Trends formula `A/B*100`) — measure how productive users are.
3. **Todo deletion trend** — `todo_deleted` over time — spot if users are cleaning up or abandoning tasks.
4. **Create → Complete funnel** — `todo_created` → `todo_completed` (Funnel insight) — conversion rate from creating a todo to completing it.
5. **Undo rate** — `todo_uncompleted` over time — see how often users reverse their completed status.

- [Create a new dashboard](https://us.posthog.com/project/2/dashboard)
- [Create new insight](https://us.posthog.com/project/2/insights/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
