<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. Client-side event tracking was added to `components/todos/todo-list.tsx` using `posthog-js`, capturing all four core user actions (create, complete, uncomplete, delete). Server-side tracking was added to both API routes (`app/api/todos/route.ts` and `app/api/todos/[id]/route.ts`) using `posthog-node` via a shared `lib/posthog-server.ts` helper. PostHog is initialized in `instrumentation-client.ts` (the recommended approach for Next.js 15.3+) and the `next.config.ts` was updated with reverse-proxy rewrites to route PostHog requests through `/ingest` for improved ad-blocker resilience. Error tracking is wired into all client-side catch blocks via `posthog.captureException()`.

| Event name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user submits the form to create a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user checks a todo item to mark it as completed. | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user unchecks a completed todo item to mark it as active again. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user clicks the delete button to remove a todo item. | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side event captured when the API route successfully creates a new todo. | `app/api/todos/route.ts` |
| `server_todo_updated` | Server-side event captured when the API route successfully updates a todo's properties. | `app/api/todos/[id]/route.ts` |
| `server_todo_deleted` | Server-side event captured when the API route successfully deletes a todo item. | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1760666)
- [Todos created over time](https://us.posthog.com/project/483112/insights/4RLKCQNL)
- [Todo completion funnel](https://us.posthog.com/project/483112/insights/F9L5JBcv)
- [Todo completion vs deletion rate](https://us.posthog.com/project/483112/insights/IsTdGM29)
- [Daily active users](https://us.posthog.com/project/483112/insights/TOkPWzPE)
- [Todos deleted trend](https://us.posthog.com/project/483112/insights/o1sl1kGj)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
