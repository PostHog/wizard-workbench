<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for this Next.js 15 Pages Router todo application. Client-side analytics are initialized via `instrumentation-client.ts` using the PostHog reverse proxy (configured in `next.config.ts`). A server-side PostHog singleton (`lib/posthog-server.ts`) powers event tracking inside the API routes. Four client-side events are captured in `components/todos/todo-list.tsx` at the moment user actions succeed, and three server-side events are captured in the corresponding API routes for full-stack coverage.

| Event | Description | File |
|---|---|---|
| `todo_created` | User creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | User marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server creates a new todo via API route | `pages/api/todos/index.ts` |
| `server_todo_updated` | Server updates a todo via API route | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server deletes a todo via API route | `pages/api/todos/[id].ts` |

## Next steps

The PostHog MCP API key used during this run lacked the `dashboard:write` and `query:read` scopes needed to create the dashboard programmatically. Please create the **"Analytics basics (wizard)"** dashboard manually using the links below, and add the following five insights:

1. **Todo creation rate** — Trends chart for `todo_created` over time
2. **Todo completion rate** — Trends chart for `todo_completed` over time
3. **Todo deletion rate** — Trends chart for `todo_deleted` over time
4. **Completion vs. reopen ratio** — Trends chart with `todo_completed` and `todo_reopened` on the same chart (formula: `A/(A+B)*100` for completion rate)
5. **Server-side todo funnel** — Funnel from `server_todo_created` → `server_todo_updated` → `server_todo_deleted` to see the lifecycle of todos

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard)
- [Create a new insight](https://us.posthog.com/project/2/insights/new)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set: `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
