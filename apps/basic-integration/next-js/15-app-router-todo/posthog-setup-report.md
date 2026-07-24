<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to improve event delivery reliability. A server-side singleton (`lib/posthog-server.ts`) using `posthog-node` tracks CRUD operations in the API routes. Client-side events in `components/todos/todo-list.tsx` pass the PostHog distinct ID as `X-POSTHOG-DISTINCT-ID` headers so server-side events are correlated to the same anonymous user. Exception capture is enabled via `capture_exceptions: true`.

| Event name | Description | File |
|---|---|---|
| `todo_created` | User successfully created a new todo item via the form. | `components/todos/todo-list.tsx` |
| `todo_completed` | User marked an active todo item as completed. | `components/todos/todo-list.tsx` |
| `todo_reopened` | User unchecked a completed todo, marking it active again. | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deleted a todo item from the list. | `components/todos/todo-list.tsx` |
| `todo_created` | Server confirmed creation of a new todo via the POST API route. | `app/api/todos/route.ts` |
| `todo_updated` | Server confirmed update of a todo (e.g. completion toggle) via the PATCH API route. | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server confirmed deletion of a todo via the DELETE API route. | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1902659)
- [Todo actions over time](https://us.posthog.com/project/483112/insights/5ExJt4Qa) — daily trend of created, completed, and deleted events
- [Todos created (last 30d)](https://us.posthog.com/project/483112/insights/JI64VK74) — bold-number KPI tile
- [Todo creation vs completion](https://us.posthog.com/project/483112/insights/x0EXzK0B) — bar chart comparing the two key actions
- [Todo completion funnel](https://us.posthog.com/project/483112/insights/81CT8JuR) — funnel from creation to completion
- [Todo reopened vs deleted](https://us.posthog.com/project/483112/insights/h1WfXQIs) — bar chart showing abandonment vs revision

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
