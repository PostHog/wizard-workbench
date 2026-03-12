<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. The integration includes client-side event tracking, server-side event tracking, automatic error capture, and a reverse proxy configuration.

**Changes made:**

- `instrumentation-client.ts` *(new)* — Initializes PostHog client-side using the Next.js 15.3+ instrumentation file convention. Enables error tracking via `capture_exceptions: true` and routes events through the `/ingest` reverse proxy.
- `lib/posthog-server.ts` *(new)* — Singleton PostHog Node.js client for server-side event capture in API routes.
- `next.config.ts` *(updated)* — Added reverse proxy rewrites for `/ingest` → PostHog US ingestion endpoint to improve reliability against ad blockers. Also added `skipTrailingSlashRedirect: true`.
- `components/todos/todo-list.tsx` *(updated)* — Added `todo_created`, `todo_completed`, `todo_reopened`, and `todo_deleted` capture calls in their respective event handlers. Added `captureException` calls in all error catch blocks.
- `app/api/todos/route.ts` *(updated)* — Added server-side `todo_created` capture on successful POST.
- `app/api/todos/[id]/route.ts` *(updated)* — Added server-side `todo_updated` capture on successful PATCH and `todo_deleted` capture on successful DELETE.
- `.env.local` *(new)* — `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo item (client-side) | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | User unchecks a completed todo | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item (client-side) | `components/todos/todo-list.tsx` |
| `todo_created` | Server confirms new todo creation via POST /api/todos | `app/api/todos/route.ts` |
| `todo_updated` | Server confirms todo update via PATCH /api/todos/[id] | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server confirms todo deletion via DELETE /api/todos/[id] | `app/api/todos/[id]/route.ts` |

## Next steps

To see user behavior in PostHog, create an "Analytics basics" dashboard with these recommended insights:

- **Todo creation trend** — Line chart of `todo_created` over time to track growth in task creation
- **Task completion funnel** — Funnel from `todo_created` → `todo_completed` to measure completion rate
- **Completion vs deletion ratio** — Bar chart comparing `todo_completed` vs `todo_deleted` counts
- **Todo reopened rate** — Line chart of `todo_reopened` to identify tasks users reconsider
- **Active users by actions** — Unique users performing any todo action per day/week

You can create these insights at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
