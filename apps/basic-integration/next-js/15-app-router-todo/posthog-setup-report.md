<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for this Next.js 15 App Router todo application. PostHog is initialised client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route analytics traffic through `/ingest`. A server-side PostHog singleton (`lib/posthog-server.ts`) handles event capture from the API routes. All four core todo actions are tracked on both the client and server, with the client passing its anonymous `distinct_id` and `session_id` to the server via `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers so events can be correlated across both layers. Error tracking is enabled via `capture_exceptions: true` and explicit `captureException` calls around API fetch calls.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user unchecks a completed todo item | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side event fired when the API successfully creates a new todo | `app/api/todos/route.ts` |
| `todo_updated` | Server-side event fired when the API successfully updates a todo | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side event fired when the API successfully deletes a todo | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1792446)
- [Todo creations over time](https://us.posthog.com/project/483112/insights/gXtM8tNV)
- [Todo completion funnel](https://us.posthog.com/project/483112/insights/qKw00GSy)
- [Todo deletions over time](https://us.posthog.com/project/483112/insights/H6dGqvUf)
- [Completed vs uncompleted toggles](https://us.posthog.com/project/483112/insights/aCq4E4j6)
- [Daily active users](https://us.posthog.com/project/483112/insights/wlgKhL9t)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any CI/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
