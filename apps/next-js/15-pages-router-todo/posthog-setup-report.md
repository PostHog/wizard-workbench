<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 Pages Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using Next.js 15.3+ instrumentation, with a reverse proxy path (`/ingest`), error tracking (`capture_exceptions: true`), and debug mode in development.
- **`next.config.ts`** (updated): Added `/ingest` rewrites to proxy PostHog requests through your Next.js server, avoiding ad-blocker interference. Also added `skipTrailingSlashRedirect: true` required by PostHog.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client (`posthog-node`) for tracking events from API routes.
- **`components/todos/todo-list.tsx`** (updated): Added `posthog.capture()` calls in all four action handlers for client-side event tracking.
- **`pages/api/todos/index.ts`** (updated): Added server-side `server_todo_created` event on successful POST.
- **`pages/api/todos/[id].ts`** (updated): Added server-side `server_todo_updated` and `server_todo_deleted` events on successful PATCH and DELETE.
- **`.env.local`** (new): Contains `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired when a user marks a completed todo item as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event fired when a new todo is persisted via POST /api/todos | `pages/api/todos/index.ts` |
| `server_todo_updated` | Server-side event fired when a todo is updated via PATCH /api/todos/[id] | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server-side event fired when a todo is deleted via DELETE /api/todos/[id] | `pages/api/todos/[id].ts` |

## Next steps

Head to your PostHog project to build insights and a dashboard based on these events:

- **Project overview**: https://us.posthog.com/project/2
- **New dashboard ("Analytics basics")**: https://us.posthog.com/project/2/dashboard/new
- **Insight — Todo creation trend**: https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"todo_created"}]
- **Insight — Todo completion funnel** (todo_created → todo_completed): https://us.posthog.com/project/2/insights/new#insight=FUNNELS
- **Insight — Todo deletion rate**: https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"todo_deleted"}]
- **Insight — Completion vs reopened**: https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"todo_completed"},{"id":"todo_reopened"}]
- **All events**: https://us.posthog.com/project/2/events

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
