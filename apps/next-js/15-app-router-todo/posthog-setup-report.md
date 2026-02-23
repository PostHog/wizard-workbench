# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 App Router todo application. The following changes were made:

- **Installed packages**: `posthog-js` (client SDK) and `posthog-node` (server SDK)
- **Created `instrumentation-client.ts`**: Initializes PostHog on the client side using the Next.js 15.3+ instrumentation API — no `PostHogProvider` wrapper needed
- **Created `lib/posthog-server.ts`**: A server-side PostHog singleton used in API routes
- **Updated `next.config.ts`**: Added reverse proxy rewrites (`/ingest/*` → PostHog) and `skipTrailingSlashRedirect: true` to avoid ad-blocker interference
- **Updated `components/todos/todo-form.tsx`**: Captures `todo_created` when a todo is successfully submitted
- **Updated `components/todos/todo-item.tsx`**: Captures `todo_completed`, `todo_reopened`, and `todo_deleted` on checkbox and delete interactions
- **Updated `components/todos/todo-list.tsx`**: Forwards `posthog.get_distinct_id()` via `x-posthog-distinct-id` header to API routes for client/server event correlation
- **Updated `app/api/todos/route.ts`**: Captures `server_todo_created` on successful POST
- **Updated `app/api/todos/[id]/route.ts`**: Captures `server_todo_updated` on PATCH and `server_todo_deleted` on DELETE

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | Fired when a user successfully creates a new todo item via the form | `components/todos/todo-form.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-item.tsx` |
| `todo_reopened` | Fired when a user marks a completed todo as incomplete | `components/todos/todo-item.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-item.tsx` |
| `server_todo_created` | Server-side event fired when a new todo is successfully persisted via the POST /api/todos endpoint | `app/api/todos/route.ts` |
| `server_todo_updated` | Server-side event fired when a todo is updated via the PATCH /api/todos/[id] endpoint (e.g. completion toggled or title edited) | `app/api/todos/[id]/route.ts` |
| `server_todo_deleted` | Server-side event fired when a todo is permanently deleted via the DELETE /api/todos/[id] endpoint | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics](https://us.posthog.com/project/2/dashboard/1195065)
- **Insight**: [Todo Activity Overview](https://us.posthog.com/project/2/insights/X1GrGf0U) — Daily trend of todos created, completed, and deleted
- **Insight**: [Todo Completion Funnel](https://us.posthog.com/project/2/insights/wQrzcm5m) — Funnel showing conversion from creating a todo to completing it
- **Insight**: [Server-Side Events](https://us.posthog.com/project/2/insights/zM32JSUp) — Track server-side todo operations (created, updated, deleted)
- **Insight**: [Form Submission Rate](https://us.posthog.com/project/2/insights/xqtL1q4D) — Daily trend of todo form submissions
- **Insight**: [API Errors](https://us.posthog.com/project/2/insights/jwfkweV1) — Track server-side API errors

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
