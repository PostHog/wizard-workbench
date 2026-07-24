# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router todo application. PostHog is now initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route analytics through `/ingest` and avoid ad blockers. A server-side singleton client in `lib/posthog-server.ts` handles server-side event tracking in the API routes. Client-side events fire in `components/todos/todo-list.tsx` event handlers, and the client passes its PostHog distinct ID and session ID as request headers so server-side events are correlated with the same user session. Exception capture is enabled via `capture_exceptions: true` in the init config, and `posthog.captureException()` is called in client-side error paths.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `todo_created` | Fired on the client when a new todo is successfully created via the add form. | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired on the client when a user marks an active todo as completed. | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired on the client when a user unchecks a completed todo, marking it active again. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired on the client when a user successfully deletes a todo item. | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side event fired when a todo is successfully persisted via POST /api/todos. | `app/api/todos/route.ts` |
| `todo_updated` | Server-side event fired when a todo is updated via PATCH /api/todos/[id]. | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side event fired when a todo is removed via DELETE /api/todos/[id]. | `app/api/todos/[id]/route.ts` |

## Files created or modified

| File | Change |
|---|---|
| `instrumentation-client.ts` | Created — initializes posthog-js client-side with reverse proxy and exception capture |
| `next.config.ts` | Updated — added `/ingest` rewrites for the PostHog reverse proxy |
| `lib/posthog-server.ts` | Created — server-side PostHog singleton using posthog-node |
| `components/todos/todo-list.tsx` | Updated — added client-side capture for all four user actions |
| `app/api/todos/route.ts` | Updated — added server-side capture for todo creation |
| `app/api/todos/[id]/route.ts` | Updated — added server-side capture for todo update and delete |
| `.env.local` | Created — `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` |

## Next steps

We've built a dashboard and five insights for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1901935)
- **Insight**: [Todo activity over time](https://us.posthog.com/project/483112/insights/Ni4ASl5A) — all todo events per day
- **Insight**: [Todo completion funnel](https://us.posthog.com/project/483112/insights/MtvOY7dr) — conversion from created → completed
- **Insight**: [Todos with descriptions](https://us.posthog.com/project/483112/insights/DOAngsrm) — created events broken down by `has_description`
- **Insight**: [Todo deletions: completed vs active](https://us.posthog.com/project/483112/insights/O1IXxess) — deleted events broken down by `was_completed`
- **Insight**: [Daily active users](https://us.posthog.com/project/483112/insights/RToylEGA) — unique users performing todo actions per day

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
