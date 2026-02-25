<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router Todo application. Here's a summary of what was done:

## Changes Made

### New files created
- **`instrumentation-client.ts`** — Client-side PostHog initialization using `posthog-js`. Initialises PostHog with a reverse proxy (`/ingest`), automatic exception capture (Error Tracking), and debug mode in development.
- **`lib/posthog-server.ts`** — Server-side PostHog singleton using `posthog-node`, shared across API routes. Configured with `flushAt: 1` and `flushInterval: 0` for immediate event delivery in serverless API routes.

### Modified files
- **`next.config.ts`** — Added reverse proxy rewrites (`/ingest/*` → PostHog ingestion URLs) and `skipTrailingSlashRedirect: true` to support PostHog's API path patterns.
- **`components/todos/todo-list.tsx`** — Added four client-side events with `posthog.capture()` and exception tracking with `posthog.captureException()`. PostHog distinct ID and session ID are passed as request headers (`X-POSTHOG-DISTINCT-ID`, `X-POSTHOG-SESSION-ID`) to all API mutations so client and server events can be correlated.
- **`pages/api/todos/index.ts`** — Added server-side `todo_created` event on successful POST (todo creation), using the distinct ID from request headers.
- **`pages/api/todos/[id].ts`** — Added server-side `todo_updated` (PATCH) and `todo_deleted` (DELETE) events, using the distinct ID from request headers.

### Environment variables set
`.env.local` now contains:
```
NEXT_PUBLIC_POSTHOG_KEY=<your-posthog-project-api-key>
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Package installed
- `posthog-js` — Client-side analytics SDK
- `posthog-node` — Server-side analytics SDK

## Events Instrumented

| Event | Description | File |
|-------|-------------|------|
| `todo_added` | Fired client-side when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired client-side when a user checks off a todo item as complete | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired client-side when a user unchecks a completed todo, marking it active again | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired client-side when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: fired when a todo is successfully created via POST `/api/todos` | `pages/api/todos/index.ts` |
| `todo_updated` | Server-side: fired when a todo is updated via PATCH `/api/todos/[id]` | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server-side: fired when a todo is deleted via DELETE `/api/todos/[id]` | `pages/api/todos/[id].ts` |

## Next steps

Visit your [PostHog project](https://us.posthog.com/project/238460) to explore your data. Here are some recommended insights to build in an **"Analytics basics"** dashboard:

1. **Todo Creation Trend** — Trend chart for `todo_added` — shows new task creation over time.
   - [Create this insight](https://us.posthog.com/project/238460/insights/new?insight=TRENDS)

2. **Task Completion Funnel** — Funnel from `todo_added` → `todo_completed` — measures how many created tasks are actually completed.
   - [Create this insight](https://us.posthog.com/project/238460/insights/new?insight=FUNNELS)

3. **Todo Actions Breakdown** — Multi-series trend of `todo_added`, `todo_completed`, and `todo_deleted` — overall engagement health.
   - [Create this insight](https://us.posthog.com/project/238460/insights/new?insight=TRENDS)

4. **Deletion Rate** — Trend chart for `todo_deleted` — a churn signal showing tasks being abandoned.
   - [Create this insight](https://us.posthog.com/project/238460/insights/new?insight=TRENDS)

5. **Reopen Rate** — Trend chart for `todo_reopened` — shows user reconsideration behavior.
   - [Create this insight](https://us.posthog.com/project/238460/insights/new?insight=TRENDS)

[View your PostHog project dashboard](https://us.posthog.com/project/238460/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
