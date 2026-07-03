<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Next.js Pages Router todo application with PostHog. Client-side PostHog initialization was added through `instrumentation-client.ts`, server-side capture support was added through `lib/posthog-server.ts`, the app now captures todo lifecycle and CTA events in the UI, and API routes now capture server-side analytics plus exception context for critical todo operations. A reverse proxy was also configured in `next.config.ts`, and PostHog environment variables were written to `.env.local`.

| Event name | Description | File |
| --- | --- | --- |
| todo_list_loaded | Captured when the todo list successfully loads from the API. | components/todos/todo-list.tsx |
| todo_created | Captured when a new todo is successfully created from the form. | components/todos/todo-list.tsx |
| todo_creation_failed | Captured when creating a todo fails in the client or API. | components/todos/todo-list.tsx |
| todo_completion_toggled | Captured when a todo is marked complete or incomplete. | components/todos/todo-list.tsx |
| todo_deleted | Captured when a todo is successfully deleted. | components/todos/todo-list.tsx |
| about_page_cta_clicked | Captured when the user clicks the return link from the about page. | pages/about.tsx |
| api_todos_listed | Captured on the server when the todos collection is fetched. | pages/api/todos/index.ts |
| api_todo_created | Captured on the server when a todo is created. | pages/api/todos/index.ts |
| api_todo_updated | Captured on the server when a todo is updated. | pages/api/todos/[id].ts |
| api_todo_deleted | Captured on the server when a todo is deleted. | pages/api/todos/[id].ts |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1796154
- Insight: Todo lifecycle funnel (wizard dashboard) — https://us.posthog.com/project/483112/insights/lG5Ae595
- Insight: Todo creation failures (wizard dashboard) — https://us.posthog.com/project/483112/insights/TiWpvxrG
- Insight: Todo deletion trend (wizard dashboard) — https://us.posthog.com/project/483112/insights/d2ohQmuY
- Insight: Todo completion trend (wizard dashboard) — https://us.posthog.com/project/483112/insights/Lywat7eY
- Insight: Todo created trend (wizard dashboard) — https://us.posthog.com/project/483112/insights/YrUx8a9u

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
