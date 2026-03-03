<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Client-side PostHog initialization using the Next.js 15.3+ `instrumentation-client` pattern. Configures the reverse proxy (`/ingest`), enables exception capture, and turns on debug mode in development.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog Node.js client used by API routes to capture server-side events.
- **`next.config.ts`** (updated): Added reverse proxy rewrites for PostHog ingestion to reduce ad-blocker interference.
- **`components/todos/todo-list.tsx`** (updated): Added client-side `posthog.capture()` calls for all key todo actions, plus `posthog.captureException()` in error handlers.
- **`app/api/todos/route.ts`** (updated): Added server-side event capture for `todo_created` via the PostHog Node SDK.
- **`app/api/todos/[id]/route.ts`** (updated): Added server-side event capture for `todo_updated` and `todo_deleted` via the PostHog Node SDK.
- **`.env.local`** (updated): Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User successfully created a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marked a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | User marked a completed todo item as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deleted a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: new todo created via POST /api/todos | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: todo updated via PATCH /api/todos/[id] | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side: todo deleted via DELETE /api/todos/[id] | `app/api/todos/[id]/route.ts` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Todo creation trend** — Trend of `todo_created` events over time. Tracks how often users create new todos.
2. **Todo completion funnel** — Funnel: `todo_created` → `todo_completed`. Reveals how many todos get completed vs. abandoned.
3. **Completion vs. deletion** — Compare `todo_completed` and `todo_deleted` event volumes. Signals whether users are finishing tasks or giving up on them.
4. **Todo reopened rate** — Trend of `todo_reopened` events. Indicates rework or regret patterns.
5. **Total todo activity** — Stacked bar or table of all `todo_*` events by type. Gives an at-a-glance overview of overall app engagement.

Create the dashboard at: [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
