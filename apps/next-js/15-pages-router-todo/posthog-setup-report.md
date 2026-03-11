<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router todo application. The integration covers client-side event tracking with `posthog-js`, server-side tracking with `posthog-node`, a reverse proxy configuration via Next.js rewrites, and cross-layer correlation using PostHog distinct ID and session ID headers passed from client to server API routes.

## Changes made

| File | Change |
|------|--------|
| `instrumentation-client.ts` | Created — initializes PostHog client-side SDK using `posthog-js`, with reverse proxy (`/ingest`), error tracking (`capture_exceptions: true`), and debug mode in development |
| `lib/posthog-server.ts` | Created — singleton server-side PostHog client using `posthog-node` with `flushAt: 1` and `flushInterval: 0` for Next.js API routes |
| `next.config.ts` | Updated — added reverse proxy rewrites for `/ingest/static/:path*` and `/ingest/:path*`, plus `skipTrailingSlashRedirect: true` |
| `components/todos/todo-list.tsx` | Updated — added `posthog.capture()` calls for all four todo events, plus `posthog.captureException()` in error handlers; added `x-posthog-distinct-id` and `x-posthog-session-id` headers to all API fetch calls |
| `pages/api/todos/index.ts` | Updated — added server-side PostHog capture for `todo_created` on successful POST, reading `x-posthog-distinct-id` and `x-posthog-session-id` headers for client-server correlation |
| `pages/api/todos/[id].ts` | Updated — added server-side PostHog capture for `todo_completed`, `todo_reopened`, and `todo_deleted` on successful PATCH/DELETE operations |
| `.env.local` | Created — `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables |

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx`, `pages/api/todos/index.ts` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx`, `pages/api/todos/[id].ts` |
| `todo_reopened` | Fired when a user marks a completed todo as incomplete | `components/todos/todo-list.tsx`, `pages/api/todos/[id].ts` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx`, `pages/api/todos/[id].ts` |

## Next steps

To build insights and a dashboard for the events instrumented above, visit your PostHog project and create a new dashboard named "Analytics basics". Suggested insights:

1. **Todo creation trend** — Trend chart of `todo_created` over time
2. **Todo completion rate** — Funnel: `todo_created` → `todo_completed`
3. **Todo deletion rate** — Trend of `todo_deleted` events (churn signal)
4. **Todo reopen rate** — Trend of `todo_reopened` (engagement signal)
5. **Task lifecycle** — Stacked bar: `todo_created`, `todo_completed`, `todo_reopened`, `todo_deleted` per day

Visit your [PostHog project](https://us.posthog.com/project/2) to explore data once events start flowing.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
