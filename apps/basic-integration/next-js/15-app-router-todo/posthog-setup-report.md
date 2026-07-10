# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog on the client side via Next.js's instrumentation API. Uses a reverse proxy (`/ingest`) to route analytics through the app, enables exception autocapture for error tracking, and turns on debug mode in development.
- **`next.config.ts`** (updated): Added reverse proxy rewrites for `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*` pointing to PostHog's US asset and ingestion hosts. Also set `skipTrailingSlashRedirect: true` as required by PostHog.
- **`lib/posthog-server.ts`** (new): Singleton PostHog Node.js client used across API routes. Configured with `flushAt: 1` and `flushInterval: 0` for immediate event delivery in Next.js serverless handlers.
- **`components/todos/todo-list.tsx`** (updated): Added `posthog.capture()` calls for all four core user actions. Each fetch request to the API passes the client's `distinct_id` and `session_id` as headers so server-side events can be correlated with the same user.
- **`app/api/todos/route.ts`** (updated): Captures a server-side `todo_created` event with `todo_id` and `has_description` properties after a todo is successfully persisted.
- **`app/api/todos/[id]/route.ts`** (updated): Captures `todo_updated` (with `completed` status) and `todo_deleted` server-side events after successful PATCH and DELETE operations respectively.
- **`.env.local`** (created): `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` populated with correct values.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo item as completed. | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired when a user marks a completed todo as incomplete again. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item. | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side event fired when a new todo is successfully persisted via the API. | `app/api/todos/route.ts` |
| `todo_updated` | Server-side event fired when an existing todo is updated via the API. | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side event fired when a todo is deleted via the API. | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1829242)
- [Todo activity over time](https://us.posthog.com/project/483112/insights/oHDXGlYP) — line chart comparing creation, completion, and deletion trends day by day
- [Todo completion funnel](https://us.posthog.com/project/483112/insights/od5TBxUY) — funnel showing what fraction of users who create a todo also complete it within 14 days
- [Todos created per day](https://us.posthog.com/project/483112/insights/koUQ9M0G) — daily bar chart of creation volume
- [Todo deletion rate](https://us.posthog.com/project/483112/insights/Y7wRdsn8) — daily line chart of deletion activity, a useful churn signal
- [Todos with descriptions breakdown](https://us.posthog.com/project/483112/insights/Q9dL8xrR) — breakdown of created todos by whether they include a description

Dashboard subscription and alerts were not set up in this run (consent prompt unavailable in this environment). You can configure a weekly email digest and funnel-drop alert directly in PostHog from the dashboard page.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
