# PostHog post-wizard report

The wizard completed a PostHog integration for this Next.js Pages Router todo app by installing the browser and server SDKs, initializing client-side PostHog through `instrumentation-client.ts`, adding a reverse-proxy rewrite setup in `next.config.ts`, configuring environment variables in `.env.local`, and instrumenting both client-side and API-route todo lifecycle events with error capture.

| Event name | Description | File |
| --- | --- | --- |
| `todo_list_loaded` | Captures when the todo list finishes loading successfully on the home screen. | `components/todos/todo-list.tsx` |
| `todo_created` | Captures when a user successfully creates a new todo from the form. | `components/todos/todo-list.tsx` |
| `todo_completion_toggled` | Captures when a user marks a todo as completed or active from the list. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Captures when a user deletes a todo from the list. | `components/todos/todo-list.tsx` |
| `todo_created_api` | Captures when the API successfully creates a todo on the server. | `pages/api/todos/index.ts` |
| `todo_list_requested_api` | Captures when the API successfully returns the todo collection. | `pages/api/todos/index.ts` |
| `todo_updated_api` | Captures when the API successfully updates a todo on the server. | `pages/api/todos/[id].ts` |
| `todo_deleted_api` | Captures when the API successfully deletes a todo on the server. | `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1846784)
- [Todo creations over time (wizard)](https://us.posthog.com/project/483112/insights/0m7FTK0s)
- [Todo lifecycle actions (wizard)](https://us.posthog.com/project/483112/insights/izAzZZun)
- [Todo list loads (wizard)](https://us.posthog.com/project/483112/insights/9SnlkUZ5)
- [Todo creation funnel (wizard)](https://us.posthog.com/project/483112/insights/R19r2dtp)
- [Todo deletions over time (wizard)](https://us.posthog.com/project/483112/insights/EFSSQZw3)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
