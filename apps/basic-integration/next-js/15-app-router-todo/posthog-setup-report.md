<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router todo application. The integration covers client-side analytics via `posthog-js`, server-side analytics via `posthog-node`, a reverse proxy to reduce ad-blocker interference, automatic exception tracking, and cross-domain user correlation via the `X-POSTHOG-DISTINCT-ID` header.

**Files created:**
- `instrumentation-client.ts` — initializes `posthog-js` on the client using Next.js's native instrumentation hook, with `/ingest` reverse proxy, `capture_exceptions: true`, and the `2026-01-30` defaults bundle.
- `lib/posthog-server.ts` — singleton `posthog-node` client used by API routes.

**Files modified:**
- `next.config.ts` — added `/ingest/*` rewrites to proxy PostHog events through the app, and `skipTrailingSlashRedirect: true`.
- `components/todos/todo-list.tsx` — added four `posthog.capture()` calls in the todo CRUD handlers, passed `X-POSTHOG-DISTINCT-ID` to each API request, and added `posthog.captureException()` in error paths.
- `app/api/todos/route.ts` — added server-side `todo_created` capture in the POST handler.
- `app/api/todos/[id]/route.ts` — added server-side `todo_updated` capture in the PATCH handler and `todo_deleted` capture in the DELETE handler.

**Environment variables set in `.env.local`:**
- `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`
- `NEXT_PUBLIC_POSTHOG_HOST`

## Events

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | Fired on the client when a new todo is successfully created | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired on the client when a todo is marked as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired on the client when a completed todo is marked active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired on the client when a todo is successfully deleted | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: fired when POST /api/todos creates a todo | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: fired when PATCH /api/todos/[id] updates a todo | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side: fired when DELETE /api/todos/[id] deletes a todo | `app/api/todos/[id]/route.ts` |

## Next steps

Visit your PostHog project to create an "Analytics basics" dashboard. Suggested insights to add:

- **Todo creation trend** — Trends chart for `todo_created` over time
- **Completion rate** — Formula insight: `todo_completed / (todo_completed + todo_deleted)` to track how often todos get finished vs discarded
- **Todo lifecycle funnel** — Funnel from `todo_created` → `todo_completed` to see completion rates
- **Delete rate over time** — Trends chart for `todo_deleted` to track churn of tasks
- **Active vs completed breakdown** — Trends with breakdown on the `completed` property of `todo_updated`

Open your [PostHog project dashboards](/dashboard) to get started.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
