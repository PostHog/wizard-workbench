<wizard-report>
# PostHog post-wizard report

The wizard completed a Next.js Pages Router PostHog integration for this todo app by initializing the browser SDK in `instrumentation-client.ts`, adding a server-side PostHog client for API routes, wiring a reverse proxy through Next.js rewrites, configuring local environment variables, and instrumenting client and server todo lifecycle events plus error capture.

| Event name | Description | File |
| --- | --- | --- |
| todo_list_viewed | Captured when the todo list loads successfully for a visitor. | components/todos/todo-list.tsx |
| todo_created | Captured when a new todo is successfully created from the form. | components/todos/todo-list.tsx |
| todo_creation_failed | Captured when creating a todo fails on the client or server. | components/todos/todo-list.tsx |
| todo_completion_toggled | Captured when a todo is marked complete or incomplete. | components/todos/todo-list.tsx |
| todo_deleted | Captured when a todo is successfully deleted. | components/todos/todo-list.tsx |
| todo_create_submitted | Captured when the add todo form is submitted with content. | components/todos/todo-form.tsx |
| about_page_cta_clicked | Captured when the visitor clicks the return CTA on the about page. | pages/about.tsx |
| todos_list_requested | Captured on the server when the todos API list endpoint is requested successfully. | pages/api/todos/index.ts |
| todo_created_api | Captured on the server when the todos API creates a todo. | pages/api/todos/index.ts |
| todo_updated_api | Captured on the server when a todo is updated through the API. | pages/api/todos/[id].ts |
| todo_deleted_api | Captured on the server when a todo is deleted through the API. | pages/api/todos/[id].ts |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1796153
- Insight: Todo creations over time (wizard) — https://us.posthog.com/project/483112/insights/IiZlY1Kc
- Insight: Todo lifecycle conversion funnel (wizard) — https://us.posthog.com/project/483112/insights/MN2e197F
- Insight: Todo operations mix (wizard) — https://us.posthog.com/project/483112/insights/gJCs8dpQ
- Insight: Server API activity (wizard) — https://us.posthog.com/project/483112/insights/gIo6iZPq
- Insight: About CTA clicks (wizard) — https://us.posthog.com/project/483112/insights/Q6SN7nM2

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
