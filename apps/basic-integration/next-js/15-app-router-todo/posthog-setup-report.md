<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. The integration includes client-side initialization via `instrumentation-client.ts` (the recommended pattern for Next.js 15.3+), a server-side PostHog singleton in `lib/posthog-server.ts`, a reverse proxy configuration in `next.config.ts`, client-side event capture for all four core todo actions in `components/todos/todo-list.tsx`, and server-side event capture in both API route handlers. The client passes its PostHog distinct ID and session ID as request headers so that client-side and server-side events can be correlated per user.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | Fires when the user successfully creates a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | Fires when the user marks a todo item as completed. | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fires when the user unchecks a completed todo item. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fires when the user deletes a todo item. | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side capture when a new todo is successfully persisted via the API. | `app/api/todos/route.ts` |
| `server_todo_updated` | Server-side capture when a todo is updated (e.g. completion toggled) via the API. | `app/api/todos/[id]/route.ts` |
| `server_todo_deleted` | Server-side capture when a todo is deleted via the API. | `app/api/todos/[id]/route.ts` |

## Next steps

Dashboard creation was not possible in this CI environment due to API key scope limitations. To create a dashboard named **"Analytics basics (wizard)"** for these events, visit:

- https://us.posthog.com/project/2/dashboard/new

Suggested insights to add:
1. **Todo creation volume** — Trends chart of `todo_created` over time
2. **Todo completion funnel** — Funnel: `todo_created` → `todo_completed` (conversion rate)
3. **Todo deletion rate** — Trends chart of `todo_deleted` over time
4. **Daily active users** — Unique users performing any todo event per day
5. **Completion vs deletion comparison** — Trends: `todo_completed` vs `todo_deleted` side-by-side

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
