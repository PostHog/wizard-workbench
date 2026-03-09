# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. The integration covers both client-side and server-side event tracking using `posthog-js` and `posthog-node`, with a reverse proxy configured in `next.config.ts` to route analytics requests through the app's own domain (avoiding ad blockers).

**Changes made:**

- `instrumentation-client.ts` — New file. Initializes PostHog client-side using the Next.js 15.3+ instrumentation hook. Enables autocapture, exception capture, and debug mode in development.
- `next.config.ts` — Updated to add PostHog reverse proxy rewrites (`/ingest/*` → PostHog US servers) and `skipTrailingSlashRedirect: true`.
- `lib/posthog-server.ts` — New file. Singleton server-side PostHog client (using `posthog-node`) for capturing events from API routes.
- `components/todos/todo-list.tsx` — Updated to capture `todo_created`, `todo_completed`, `todo_reopened`, and `todo_deleted` events client-side, plus `captureException` on errors. Also passes `X-PostHog-Distinct-ID` and `X-PostHog-Session-ID` headers to API routes for cross-environment user correlation.
- `pages/api/todos/index.ts` — Updated to capture `todo_created` server-side when a new todo is created via POST.
- `pages/api/todos/[id].ts` — Updated to capture `todo_completed`/`todo_reopened` on PATCH and `todo_deleted` on DELETE server-side.

| Event | Description | File(s) |
|---|---|---|
| `todo_created` | Fired when the user successfully creates a new todo item | `components/todos/todo-list.tsx`, `pages/api/todos/index.ts` |
| `todo_completed` | Fired when the user marks a todo as completed | `components/todos/todo-list.tsx`, `pages/api/todos/[id].ts` |
| `todo_reopened` | Fired when the user marks a completed todo as incomplete | `components/todos/todo-list.tsx`, `pages/api/todos/[id].ts` |
| `todo_deleted` | Fired when the user deletes a todo item | `components/todos/todo-list.tsx`, `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1195065) — Overview of core todo app analytics including todo activity, completion funnel, and user engagement

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
