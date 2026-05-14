<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 15 App Router todo application with PostHog. Here's a summary of what was set up:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the recommended `instrumentation-client` pattern for Next.js 15.3+. Includes reverse proxy routing, exception capture, and debug mode in development.
- **`next.config.ts`** (updated): Added reverse proxy rewrites for PostHog ingestion (`/ingest/*`) and assets, reducing the chance of ad-blocker interference.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node`, configured with `flushAt: 1` and `flushInterval: 0` for immediate event delivery.
- **`components/todos/todo-list.tsx`** (updated): Captures client-side events for todo creation, completion, uncompletion, and deletion. Also captures exceptions on API failures.
- **`app/api/todos/route.ts`** (updated): Captures `todo_created` server-side when a todo is successfully persisted.
- **`app/api/todos/[id]/route.ts`** (updated): Captures `todo_updated` (with completion status) and `todo_deleted` server-side.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User successfully created a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marked a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marked a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deleted a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: todo successfully created via API | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: todo updated (completion toggled) | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side: todo deleted via API | `app/api/todos/[id]/route.ts` |

## Next steps

Here are some insights and a dashboard to build in PostHog to monitor user behavior based on the events we instrumented:

- **[Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard)** — Click "New dashboard" and name it "Analytics basics".

Recommended insights to add:

- **[Todo creation trend](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo_created","name":"todo_created","type":"events"}]})** — Line chart of `todo_created` over time; shows growth in task creation.
- **[Todo completion funnel](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"todo_created","name":"todo_created","type":"events"},{"id":"todo_completed","name":"todo_completed","type":"events"}]})** — Funnel from `todo_created` → `todo_completed`; reveals what % of created todos actually get done.
- **[Todo deletion rate](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo_deleted","name":"todo_deleted","type":"events"}]})** — Trend of `todo_deleted`; high deletion may indicate users create todos impulsively.
- **[Active users taking todo actions](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo_created","name":"todo_created","type":"events"},{"id":"todo_completed","name":"todo_completed","type":"events"},{"id":"todo_deleted","name":"todo_deleted","type":"events"}],"display":"ActionsLineGraph","breakdown_type":"event"})** — Stacked breakdown of all todo actions by type.
- **[Completion vs deletion ratio](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo_completed","name":"todo_completed","type":"events"},{"id":"todo_deleted","name":"todo_deleted","type":"events"}]})** — Compare completions vs deletions to understand whether users are completing work or abandoning it.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
