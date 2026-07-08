# PostHog post-wizard report

The wizard has completed a full PostHog integration for this Next.js 15 App Router todo application. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+) with automatic exception capture and a reverse proxy configured in `next.config.ts`. A `lib/posthog-server.ts` singleton provides server-side tracking via `posthog-node` across all API routes. Four client-side events are captured in `components/todos/todo-list.tsx` on every meaningful user action, with `captureException` added to each error handler. Three server-side events are captured in the API routes, using the `x-posthog-distinct-id` request header for user correlation.

| Event name | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo item from the client. | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks an active todo as completed. | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo back to active. | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item from the list. | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server confirms a new todo was successfully persisted via the POST API route. | `app/api/todos/route.ts` |
| `server_todo_updated` | Server confirms a todo was updated (e.g., completion toggled) via the PATCH API route. | `app/api/todos/[id]/route.ts` |
| `server_todo_deleted` | Server confirms a todo was deleted via the DELETE API route. | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818191)
- [Todo activity over time (wizard)](https://us.posthog.com/project/483112/insights/fOgUt1wJ)
- [Todo completion funnel (wizard)](https://us.posthog.com/project/483112/insights/jlU4jNa6)
- [Todos created (last 7 days) (wizard)](https://us.posthog.com/project/483112/insights/8mZbtNcb)
- [Todo actions breakdown (wizard)](https://us.posthog.com/project/483112/insights/4Wl7Yc6I)
- [Todo deletions over time (wizard)](https://us.posthog.com/project/483112/insights/jWVQXdTj)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
