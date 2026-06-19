# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router Todo application. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route analytics traffic through `/ingest`. A server-side PostHog client (`lib/posthog-server.ts`) handles event capture in API routes. Seven events are now tracked across four files covering all key user actions.

| Event Name | Description | File |
|---|---|---|
| `todo_added` | User successfully creates a new todo item via the form. | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed by checking its checkbox. | `components/todos/todo-list.tsx` |
| `todo_reopened` | User unchecks a completed todo item to reopen it. | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item from the list. | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side event fired when a new todo is persisted via the POST API route. | `app/api/todos/route.ts` |
| `todo_updated` | Server-side event fired when a todo's fields are updated via the PATCH API route. | `app/api/todos/[id]/route.ts` |
| `todo_deleted_api` | Server-side event fired when a todo is removed via the DELETE API route. | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [PostHog Project Dashboard](https://us.posthog.com/project/2/dashboards) — create an "Analytics basics (wizard)" dashboard here with the events above
- Suggested insights to add:
  - Trend: `todo_added` over time (creation rate)
  - Trend: `todo_completed` over time (completion rate)
  - Funnel: `todo_added` → `todo_completed` (task completion funnel)
  - Trend: `todo_deleted` over time (churn/abandonment signal)
  - Bar chart: all todo events combined (overall activity)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
