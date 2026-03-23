<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 Pages Router Todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using `posthog-js` with error tracking, debug mode in development, and a reverse proxy to `/ingest`.
- **`next.config.ts`**: Added reverse proxy rewrites for PostHog ingestion (`/ingest/...`) and set `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new): Creates a singleton `posthog-node` client for server-side event tracking in API routes.
- **`components/todos/todo-list.tsx`**: Added `todo_created`, `todo_completed`, and `todo_deleted` client-side capture calls, plus `captureException` on errors. PostHog distinct ID and session ID are forwarded as headers to API calls for client/server correlation.
- **`pages/api/todos/index.ts`**: Added server-side `todo_created_server` event on successful POST.
- **`pages/api/todos/[id].ts`**: Added server-side `todo_updated_server` event on successful PATCH, and `todo_deleted_server` event on successful DELETE.
- **`.env.local`**: PostHog public token and host configured.

| Event | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed or incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created_server` | Server-side event fired when a new todo is successfully created via the API | `pages/api/todos/index.ts` |
| `todo_updated_server` | Server-side event fired when a todo is updated (e.g. completion toggled) via the API | `pages/api/todos/[id].ts` |
| `todo_deleted_server` | Server-side event fired when a todo is successfully deleted via the API | `pages/api/todos/[id].ts` |

## Next steps

Visit your PostHog project to build insights based on the events instrumented above:

- [PostHog Project Dashboards](https://us.posthog.com/project/238460/dashboard)
- [Create a new insight: Todo Creation Trend](https://us.posthog.com/project/238460/insights/new)

Suggested insights to create:
1. **Todo creation trend** — `todo_created` event over time
2. **Todo completion rate** — `todo_completed` where `completed = true` vs `todo_created`
3. **Todo deletion rate** — `todo_deleted` over time
4. **Server vs client event correlation** — Compare `todo_created` with `todo_created_server`
5. **Error tracking** — Monitor any captured exceptions via PostHog Error Tracking

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
