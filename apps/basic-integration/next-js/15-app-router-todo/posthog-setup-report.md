<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router todo application. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route events through `/ingest`. A server-side singleton client in `lib/posthog-server.ts` captures events from API routes using `posthog-node`. Client-side error tracking via `captureException` was added to all fetch error paths in `todo-list.tsx`.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo item from the form. | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed by checking its checkbox. | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo item as incomplete by unchecking its checkbox. | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item by clicking the delete button. | `components/todos/todo-list.tsx` |
| `todo_created` | Server confirms a new todo was successfully persisted via the API. | `app/api/todos/route.ts` |
| `todo_updated` | Server confirms a todo was successfully updated via the API. | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server confirms a todo was successfully deleted via the API. | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1795750)
- [Total Todos Created](https://us.posthog.com/project/483112/insights/PnOgymMw)
- [Todos Created Over Time](https://us.posthog.com/project/483112/insights/amVYoBBs)
- [Todo Actions Breakdown](https://us.posthog.com/project/483112/insights/ebXFQJa4)
- [Todo Completion Rate](https://us.posthog.com/project/483112/insights/zFHqD5Hl)
- [Todos Deleted Over Time](https://us.posthog.com/project/483112/insights/QERRLhjN)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
