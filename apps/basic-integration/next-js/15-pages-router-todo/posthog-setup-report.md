<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Next.js Pages Router todo application with PostHog across both the browser and server. The setup now initializes `posthog-js` through `instrumentation-client.ts`, adds a reverse proxy through Next.js rewrites, configures a shared `posthog-node` client for API routes, and stores the PostHog project token and host in `.env.local` via `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`. Client-side capture was added for viewing the about page, creating todos, toggling completion, and deleting todos. Server-side capture and exception reporting were added to the todo API routes so create, list, update, and delete operations are tracked even when they happen in short-lived request handlers.

| Event name | Description | File |
| --- | --- | --- |
| `todo_created` | Captures when a new todo is successfully created from the app. | `components/todos/todo-list.tsx` |
| `todo_completion_toggled` | Captures when a todo is marked complete or returned to active. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Captures when a todo is successfully removed from the list. | `components/todos/todo-list.tsx` |
| `about_page_viewed` | Captures when the about page is viewed as a top-of-funnel engagement step. | `pages/about.tsx` |
| `todo_created_api` | Captures server-side todo creation requests that succeed. | `pages/api/todos/index.ts` |
| `todos_listed_api` | Captures server-side todo list fetch requests that succeed. | `pages/api/todos/index.ts` |
| `todo_updated_api` | Captures server-side todo update requests that succeed. | `pages/api/todos/[id].ts` |
| `todo_deleted_api` | Captures server-side todo deletion requests that succeed. | `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1831210)
- [About to todo creation funnel (wizard)](https://us.posthog.com/project/483112/insights/PPql6YVI)
- [Todo creations over time (wizard)](https://us.posthog.com/project/483112/insights/ghcwYT1P)
- [Todo completion toggles over time (wizard)](https://us.posthog.com/project/483112/insights/KoL6I8d2)
- [Todo deletions over time (wizard)](https://us.posthog.com/project/483112/insights/SpnwGmIg)
- [Todo API creates vs deletes (wizard)](https://us.posthog.com/project/483112/insights/7j734rPM)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
