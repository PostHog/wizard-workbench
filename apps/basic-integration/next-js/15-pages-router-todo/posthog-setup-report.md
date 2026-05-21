<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router todo application. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new): Initializes PostHog on the client side via Next.js instrumentation. Enables automatic pageview tracking, session replay, and exception capture. Routes events through a local `/ingest` reverse proxy.
- **`next.config.ts`** (edited): Added `/ingest` rewrites to proxy PostHog requests through the Next.js server, preventing ad-blocker interference.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog Node.js client with `flushAt: 1` and `flushInterval: 0` for immediate event flushing in API routes.
- **`.env.local`** (updated): Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.
- **`components/todos/todo-list.tsx`** (edited): Added client-side `posthog.capture()` calls for todo lifecycle events, plus `posthog.captureException()` in error handlers.
- **`pages/api/todos/index.ts`** (edited): Added server-side `todo_created` event capture on successful POST.
- **`pages/api/todos/[id].ts`** (edited): Added server-side `todo_updated` and `todo_deleted` event capture on PATCH and DELETE.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User successfully creates a new todo | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | User marks a completed todo as active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo (client-side) | `components/todos/todo-list.tsx` |
| `todo_created` | Server confirms new todo was persisted (POST /api/todos) | `pages/api/todos/index.ts` |
| `todo_updated` | Server confirms todo update (PATCH /api/todos/[id]) | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server confirms todo deletion (DELETE /api/todos/[id]) | `pages/api/todos/[id].ts` |

## Next steps

Set up the following insights and group them in a new **"Analytics basics"** dashboard in PostHog to monitor user behavior:

1. **Todo creation trend** — [New Trends insight →](https://us.posthog.com/project/2/insights/new?insight=TRENDS) Filter by `todo_created`, interval: day
2. **Todo completion funnel** — [New Funnel insight →](https://us.posthog.com/project/2/insights/new?insight=FUNNELS) Steps: `todo_created` → `todo_completed`
3. **Todo completion vs deletion** — [New Trends insight →](https://us.posthog.com/project/2/insights/new?insight=TRENDS) Compare `todo_completed` and `todo_deleted` on one chart
4. **Todo reopen rate** — [New Trends insight →](https://us.posthog.com/project/2/insights/new?insight=TRENDS) Formula: `todo_reopened / todo_completed` to see how often users change their minds
5. **Daily active todo users** — [New Trends insight →](https://us.posthog.com/project/2/insights/new?insight=TRENDS) Unique users performing any todo action per day

[Open PostHog Project →](https://us.posthog.com/project/2)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
