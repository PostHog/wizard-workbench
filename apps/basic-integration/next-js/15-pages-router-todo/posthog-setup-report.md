# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router todo application. The integration includes client-side event tracking for user interactions via `instrumentation-client.ts`, server-side event tracking for API operations, a reverse proxy configuration in `next.config.ts` for PostHog ingestion, and PostHog error tracking using `captureException`.

## Changes made

| Event Name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo item as completed. | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user marks a completed todo as incomplete. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item. | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side event fired when a new todo is successfully persisted via the API. | `pages/api/todos/index.ts` |
| `todo_updated` | Server-side event fired when a todo's fields are updated via the API. | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server-side event fired when a todo is deleted via the API. | `pages/api/todos/[id].ts` |

## Next steps

We've instrumented key todo actions. Create insights in PostHog based on these events:

- **Todos Created Over Time**: Trend of `todo_created` events
- **Todos Completed Over Time**: Trend of `todo_completed` events
- **Todo Deletion Rate**: Trend of `todo_deleted` events
- **Completion Funnel**: Funnel from `todo_created` to `todo_completed`
- **Active vs Completed**: Combined trend of `todo_created` vs `todo_completed`

[View PostHog project dashboards](https://us.posthog.com/project/2/dashboard)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
