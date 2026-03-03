<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes `posthog-js` on the client side using Next.js 15's instrumentation hook with reverse proxy support, automatic exception capture, and debug mode in development.
- **`next.config.ts`** (updated): Added `/ingest/*` rewrites to proxy PostHog requests through the app, reducing ad-blocker interference.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node`, configured for immediate flushing (`flushAt: 1`, `flushInterval: 0`) as required for Next.js API routes.
- **`components/todos/todo-list.tsx`** (updated): Added client-side `posthog.capture()` calls for all todo user actions, plus `posthog.captureException()` in error handlers.
- **`pages/api/todos/index.ts`** (updated): Added server-side capture of `todo_created` on successful POST.
- **`pages/api/todos/[id].ts`** (updated): Added server-side capture of `todo_updated` on PATCH and `todo_deleted` on DELETE.
- **`.env.local`** (updated): Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|---|---|---|
| `todo_created` | Client: fired when a new todo is successfully created | `components/todos/todo-list.tsx` |
| `todo_completed` | Client: fired when a todo is marked as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | Client: fired when a completed todo is marked as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Client: fired when a todo is deleted | `components/todos/todo-list.tsx` |
| `todo_created` | Server: fired when POST /api/todos persists a new todo | `pages/api/todos/index.ts` |
| `todo_updated` | Server: fired when PATCH /api/todos/[id] updates a todo | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server: fired when DELETE /api/todos/[id] removes a todo | `pages/api/todos/[id].ts` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in your [PostHog project](https://us.posthog.com/project/2/dashboards) with these suggested insights:

1. **Todo Creation Trend** — Trend chart of `todo_created` events over time to track daily task creation volume.
2. **Todo Completion Funnel** — Funnel from `todo_created` → `todo_completed` to measure the completion rate.
3. **Todo Deletion Rate** — Trend chart of `todo_deleted` to see how often tasks are removed rather than completed.
4. **Todo Status Changes** — Stacked chart of `todo_completed` vs `todo_reopened` to see task re-engagement.
5. **Daily Unique Users** — Unique users per day capturing `todo_created` to measure daily active user engagement.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
