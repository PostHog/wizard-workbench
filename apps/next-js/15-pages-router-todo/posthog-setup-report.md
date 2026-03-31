<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 Pages Router Todo application. The integration adds both client-side and server-side event tracking, error tracking, a reverse proxy for improved reliability, and all required initialization code.

**Changes made:**

- **`instrumentation-client.ts`** (new) — Initializes PostHog on the client side using Next.js 15.3+ instrumentation, with reverse proxy host, exception capture enabled, and debug mode in development.
- **`next.config.ts`** — Added reverse proxy rewrites for `/ingest/*` to PostHog, and `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new) — Server-side PostHog client singleton using `posthog-node`, configured for immediate event flushing.
- **`components/todos/todo-list.tsx`** — Added client-side PostHog event captures and exception tracking.
- **`pages/api/todos/index.ts`** — Added server-side `todo_created` capture on POST.
- **`pages/api/todos/[id].ts`** — Added server-side `todo_updated` and `todo_deleted` captures on PATCH/DELETE.
- **`.env.local`** — Created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User creates a new todo item via the form | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: todo successfully persisted via POST /api/todos | `pages/api/todos/index.ts` |
| `todo_updated` | Server-side: todo successfully updated via PATCH /api/todos/[id] | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server-side: todo successfully deleted via DELETE /api/todos/[id] | `pages/api/todos/[id].ts` |

## Next steps

Create an "Analytics basics" dashboard in your PostHog project to visualize the tracked events. Here are some recommended insights to build:

- **Todo Creations Over Time** — Trend of `todo_created` events to see usage growth
- **Todo Completion Funnel** — Steps: `todo_created` → `todo_completed` to track user engagement
- **Todo Actions Breakdown** — Bar chart comparing `todo_created`, `todo_completed`, `todo_deleted`
- **Completion vs Deletion Rate** — `todo_completed` vs `todo_deleted` to understand task outcomes
- **Daily Active Users** — Unique users performing any todo action

Dashboard: [PostHog Project 238460 Dashboards](https://us.posthog.com/project/238460/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
