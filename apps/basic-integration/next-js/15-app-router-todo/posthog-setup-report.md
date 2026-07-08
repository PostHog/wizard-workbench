<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog analytics integration for this Next.js 15 App Router Todo application. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route events through `/ingest` and avoid ad-blockers. A server-side client helper (`lib/posthog-server.ts`) was added for API route tracking. Client-side events fire directly from `posthog-js` in the `TodoList` component; server-side events fire from the API routes using the client's PostHog distinct ID passed via `X-POSTHOG-DISTINCT-ID` / `X-POSTHOG-SESSION-ID` request headers to keep client and server events correlated on the same user timeline.

| Event name | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo item via the add form | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks an active todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo item back to active | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server records a new todo being created (POST route) | `app/api/todos/route.ts` |
| `todo_status_updated` | Server records a todo's completion status being changed (PATCH route) | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server records a todo being deleted (DELETE route) | `app/api/todos/[id]/route.ts` |

## Next steps

We've built a dashboard and insights in PostHog to keep an eye on user behavior:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818135)
- [Todo creation trend](https://us.posthog.com/project/483112/insights/nhB5T8IB) — Daily volume of todos created
- [Todo actions overview](https://us.posthog.com/project/483112/insights/Gf9ilwBp) — Created vs completed vs deleted side-by-side
- [Todo completion funnel](https://us.posthog.com/project/483112/insights/eJfQSYM9) — Conversion rate from todo_created → todo_completed
- [Todos completed vs deleted](https://us.posthog.com/project/483112/insights/8o8eROkD) — Stacked view of completion, uncomplete, and deletion patterns
- [Todos created with description](https://us.posthog.com/project/483112/insights/rP23lE36) — Breakdown of todos created with vs without a description

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
