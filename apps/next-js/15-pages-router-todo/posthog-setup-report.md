# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. The integration includes client-side event tracking for all key user actions, server-side event tracking in all API routes, automatic error capture, a reverse proxy setup to improve reliability, and client-side PostHog initialization via `instrumentation-client.ts`.

## Files changed

| File | Change |
|------|--------|
| `instrumentation-client.ts` | **Created** — initializes PostHog client-side with reverse proxy, exception capture, and debug mode |
| `next.config.ts` | **Updated** — added `/ingest` reverse proxy rewrites and `skipTrailingSlashRedirect` |
| `lib/posthog-server.ts` | **Created** — singleton server-side PostHog Node.js client |
| `components/todos/todo-list.tsx` | **Updated** — added client-side event capture and error tracking |
| `pages/api/todos/index.ts` | **Updated** — added server-side `todo_created_api` event |
| `pages/api/todos/[id].ts` | **Updated** — added server-side `todo_updated_api` and `todo_deleted_api` events |
| `.env.local` | **Created** — `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired when a user marks a completed todo as incomplete again | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created_api` | Server-side event fired when a todo is successfully created via the API | `pages/api/todos/index.ts` |
| `todo_updated_api` | Server-side event fired when a todo is successfully updated via the API | `pages/api/todos/[id].ts` |
| `todo_deleted_api` | Server-side event fired when a todo is successfully deleted via the API | `pages/api/todos/[id].ts` |

## Next steps

To get the most out of these events, create the following insights in your PostHog project and add them to an **"Analytics basics"** dashboard:

1. **Todo creation volume (daily)** — Trend of `todo_created` events over time to track top-of-funnel engagement
   - [Create this insight →](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=[{"id":"todo_created","type":"events","math":"total"}]&date_from=-30d&interval=day)

2. **Todo completion funnel** — Funnel from `todo_created` → `todo_completed` to measure conversion
   - [Create this insight →](https://us.posthog.com/project/2/insights/new?insight=FUNNELS&events=[{"id":"todo_created","type":"events","order":0},{"id":"todo_completed","type":"events","order":1}]&date_from=-30d)

3. **Todo churn: deletions vs creations** — Compare `todo_deleted` vs `todo_created` trends to identify abandonment
   - [Create this insight →](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=[{"id":"todo_created","type":"events","math":"total"},{"id":"todo_deleted","type":"events","math":"total"}]&date_from=-30d)

4. **Completion vs reopen rate** — Compare `todo_completed` vs `todo_reopened` weekly to measure user satisfaction
   - [Create this insight →](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=[{"id":"todo_completed","type":"events","math":"total"},{"id":"todo_reopened","type":"events","math":"total"}]&date_from=-30d&interval=week&display=ActionsBarChart)

5. **Daily active users (todo interactions)** — Unique users performing any todo action per day (DAU metric)
   - [Create this insight →](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=[{"id":"todo_created","type":"events","math":"dau"},{"id":"todo_completed","type":"events","math":"dau"},{"id":"todo_deleted","type":"events","math":"dau"}]&date_from=-30d)

[View PostHog Project →](https://us.posthog.com/project/2)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
