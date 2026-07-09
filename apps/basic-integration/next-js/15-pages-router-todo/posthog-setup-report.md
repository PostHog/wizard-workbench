<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Next.js Pages Router todo application with PostHog. Client-side initialization was added through `instrumentation-client.ts`, browser ingestion was routed through Next.js rewrites, and server-side tracking was added with `posthog-node` for the todo API routes. Custom client events now cover loading the todo list, creating todos, toggling completion, deleting todos, and viewing the about page. Server-side events and exception capture now cover successful todo API operations plus API validation and runtime failures. Environment variables were added in `.env.local`, and a dashboard with five insights was created in PostHog for immediate monitoring.

| Event name | Description | File |
| --- | --- | --- |
| `todo_list_viewed` | Tracks when the main todo list is loaded and shown as the top of the task-management funnel. | `components/todos/todo-list.tsx` |
| `todo_created` | Tracks when a new todo is successfully created from the main form. | `components/todos/todo-list.tsx` |
| `todo_completion_toggled` | Tracks when a todo is marked completed or returned to active status. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Tracks when a todo is successfully removed from the list. | `components/todos/todo-list.tsx` |
| `about_page_viewed` | Tracks when the about page is viewed as a product-engagement milestone beyond the main workflow. | `pages/about.tsx` |
| `todos_fetched_api` | Tracks successful server-side retrieval of the current todo collection. | `pages/api/todos/index.ts` |
| `todo_created_api` | Tracks successful server-side creation of a new todo record. | `pages/api/todos/index.ts` |
| `todo_updated_api` | Tracks successful server-side updates to an existing todo record. | `pages/api/todos/[id].ts` |
| `todo_deleted_api` | Tracks successful server-side deletion of an existing todo record. | `pages/api/todos/[id].ts` |
| `todo_api_error` | Tracks server-side todo API failures and validation errors for operational visibility. | `pages/api/todos/index.ts`, `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825376
- Insight: Todo creation trend (wizard) — https://us.posthog.com/project/483112/insights/Nn9nBxMS
- Insight: Todo lifecycle funnel (wizard) — https://us.posthog.com/project/483112/insights/gDScJFvs
- Insight: Todo outcomes breakdown (wizard) — https://us.posthog.com/project/483112/insights/IF7Ufe1M
- Insight: API errors by endpoint (wizard) — https://us.posthog.com/project/483112/insights/fjlk9vJ2
- Insight: About page engagement (wizard) — https://us.posthog.com/project/483112/insights/eAwv0GFO

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
