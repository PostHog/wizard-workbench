<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 App Router todo application. Here's a summary of all changes made:

**New files created:**
- `instrumentation-client.ts` — Initializes `posthog-js` on the client side using Next.js 15's native instrumentation hook. Includes a reverse proxy path (`/ingest`), exception capture for error tracking, and debug mode in development.
- `lib/posthog-server.ts` — A singleton `posthog-node` client used in API routes for server-side event capture.

**Existing files updated:**
- `next.config.ts` — Added `/ingest` reverse proxy rewrites to route PostHog requests through your Next.js app (reduces tracking-blocker interference), plus `skipTrailingSlashRedirect: true`.
- `components/todos/todo-list.tsx` — Added client-side PostHog event capture for all four core todo actions, plus `captureException` on every API error path.
- `app/api/todos/route.ts` — Added server-side `server_todo_created` capture in the POST handler.
- `app/api/todos/[id]/route.ts` — Added server-side `server_todo_completed` capture in the PATCH handler and `server_todo_deleted` capture in the DELETE handler.

**Environment variables written to `.env.local`:**
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`

**Packages installed:** `posthog-js`, `posthog-node`

| Event name | Description | File |
|---|---|---|
| `todo_created` | Fired client-side when a user successfully creates a new todo | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired client-side when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired client-side when a user marks a completed todo as incomplete again | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired client-side when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event fired when a new todo is created via the API | `app/api/todos/route.ts` |
| `server_todo_completed` | Server-side event fired when a todo's completion status is updated via the API | `app/api/todos/[id]/route.ts` |
| `server_todo_deleted` | Server-side event fired when a todo is deleted via the API | `app/api/todos/[id]/route.ts` |

## Next steps

To explore your data in PostHog, here are some suggested insights to build in your project dashboard:

- **Todo Creation Trend** — Trends chart on `todo_created` (daily) to see how active users are creating tasks
- **Todo Completion Rate** — Trends chart overlaying `todo_completed` vs `todo_created` to track what percentage of todos get finished
- **Todo Lifecycle Funnel** — Funnel from `todo_created` → `todo_completed` to measure the conversion from creation to completion
- **Todo Deletion Rate** — Trends chart on `todo_deleted` broken down by the `was_completed` property to see whether users delete finished vs unfinished todos
- **Todo Activity Overview** — Multi-series trends chart with all four events (`todo_created`, `todo_completed`, `todo_reopened`, `todo_deleted`) to get a full picture of user engagement

You can create these in your PostHog project at: **https://us.posthog.com/project/2/insights**

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
