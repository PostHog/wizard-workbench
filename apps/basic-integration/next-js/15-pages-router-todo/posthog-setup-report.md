<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Next.js Pages Router todo application with PostHog. Client-side initialization was added through `instrumentation-client.ts`, a reverse proxy was configured in `next.config.ts`, server-side capture support was added with `posthog-node`, and targeted analytics plus exception capture were added for todo list loading, todo creation, completion toggles, deletions, and API-side mutations.

| Event name | Description | File |
| --- | --- | --- |
| todo_list_loaded | Tracks when the todo list finishes loading in the browser. | components/todos/todo-list.tsx |
| todo_created | Tracks when a user successfully creates a todo from the app UI. | components/todos/todo-list.tsx |
| todo_completion_toggled | Tracks when a todo is marked complete or reopened from the app UI. | components/todos/todo-list.tsx |
| todo_deleted | Tracks when a user successfully deletes a todo from the app UI. | components/todos/todo-list.tsx |
| todo_created_api | Tracks successful todo creation in the server API route. | pages/api/todos/index.ts |
| todo_updated_api | Tracks successful todo updates in the server API route. | pages/api/todos/[id].ts |
| todo_deleted_api | Tracks successful todo deletion in the server API route. | pages/api/todos/[id].ts |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1831060)
- [Todos created over time (wizard)](https://us.posthog.com/project/483112/insights/0fMieOGl)
- [Todo lifecycle funnel (wizard)](https://us.posthog.com/project/483112/insights/ed3WZuFY)
- [Todo completion outcomes (wizard)](https://us.posthog.com/project/483112/insights/wpFawYxy)
- [Todo deletion mix (wizard)](https://us.posthog.com/project/483112/insights/nI5RGe4X)
- [Server-side todo mutations (wizard)](https://us.posthog.com/project/483112/insights/V6LZHfxA)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
