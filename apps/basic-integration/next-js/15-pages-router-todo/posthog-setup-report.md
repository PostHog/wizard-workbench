# PostHog post-wizard report

The wizard integrated PostHog into this Next.js Pages Router todo application. The browser SDK is initialized in `instrumentation-client.ts` using environment variables, with default autocapture, session recording, and exception capture behavior preserved. Client-side todo actions emit analytics events, and server-side API mutations use `posthog-node` with awaited flushing for short-lived API requests. PostHog credentials are configured in `.env.local` and are not embedded in source code.

| Event | Description | File |
|---|---|---|
| `todo_created` | A user successfully creates a new todo. | `components/todos/todo-list.tsx` |
| `todo_completed` | A user marks a todo as completed. | `components/todos/todo-list.tsx` |
| `todo_reopened` | A user marks a completed todo as active again. | `components/todos/todo-list.tsx` |
| `todo_deleted` | A user successfully deletes a todo. | `components/todos/todo-list.tsx` |
| `todo_created_server` | The server successfully persists a newly created todo. | `pages/api/todos/index.ts` |
| `todo_updated_server` | The server successfully persists a todo update. | `pages/api/todos/[id].ts` |
| `todo_deleted_server` | The server successfully deletes a todo. | `pages/api/todos/[id].ts` |

## Next steps

The PostHog MCP server was unavailable during this run (`posthog` connection refused), so the requested live dashboard, insights, and notebook could not be created.

- Dashboard: not created — retry dashboard creation when the PostHog MCP server is available.
- Insights: not created — retry after creating the dashboard.
- Notebook: not created — retry after the dashboard and setup report are available through PostHog MCP.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the integration.
- [ ] Run the test suite; instrumented API and client call sites may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any deployment/bootstrap configuration used by collaborators.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler’s upload step) into CI so production stack traces de-minify.

### Agent skill

The installed agent skill is available in `.claude/skills/integration-nextjs-pages-router` for future PostHog-related development.
