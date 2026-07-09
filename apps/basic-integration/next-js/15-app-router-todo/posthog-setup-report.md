<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. Client-side event tracking was added to the `TodoList` component for all primary user actions (create, complete, uncomplete, delete). Matching server-side events were added to both API route handlers (`/api/todos` and `/api/todos/[id]`), passing the client's PostHog distinct ID and session ID via request headers so client and server events can be correlated per-user. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+) with exception auto-capture enabled. A reverse proxy was configured in `next.config.ts` so requests route through `/ingest` to avoid ad-blocker interference. A server-side PostHog client singleton was created in `lib/posthog-server.ts` for use in API routes.

| Event name | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo item via the form. | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed by checking its checkbox. | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo item as incomplete by unchecking its checkbox. | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item by clicking the delete button. | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event captured when a new todo is created via the API route. | `app/api/todos/route.ts` |
| `server_todo_updated` | Server-side event captured when a todo is updated via the API route. | `app/api/todos/[id]/route.ts` |
| `server_todo_deleted` | Server-side event captured when a todo is deleted via the API route. | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1824513)
- [Todos created over time](https://us.posthog.com/project/483112/insights/XPXBGWyQ)
- [Todo completions vs uncompletion](https://us.posthog.com/project/483112/insights/iMOsbLD2)
- [Todos deleted over time](https://us.posthog.com/project/483112/insights/iE9v6Dsr)
- [Todo creation to completion funnel](https://us.posthog.com/project/483112/insights/2J2m2OON)
- [Total todo actions](https://us.posthog.com/project/483112/insights/2TdI3Zko)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
