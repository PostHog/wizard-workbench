<wizard-report>
# PostHog post-wizard report

The wizard has integrated PostHog into this Next.js 15 App Router todo app. It initializes posthog-js via instrumentation-client.ts, proxies ingestion through Next.js rewrites, and adds targeted client and server event captures aligned with the example project. Server routes use posthog-node with env-driven configuration and correlate requests using the X-POSTHOG-DISTINCT-ID header from the client.

| Event name | Description | File |
| --- | --- | --- |
| todo_created | A user created a new todo item from the client UI. | components/todos/todo-list.tsx |
| todo_completed | A user marked a todo item as completed from the client UI. | components/todos/todo-list.tsx |
| todo_uncompleted | A user marked a todo item as not completed from the client UI. | components/todos/todo-list.tsx |
| todo_deleted | A user deleted a todo item from the client UI. | components/todos/todo-list.tsx |
| api_todos_listed | Server returned the list of todos via the GET /api/todos endpoint. | app/api/todos/route.ts |
| api_todo_created | Server created a new todo item via the POST /api/todos endpoint. | app/api/todos/route.ts |
| api_todo_updated | Server updated a todo item via the PATCH /api/todos/[id] endpoint. | app/api/todos/[id]/route.ts |
| api_todo_deleted | Server deleted a todo item via the DELETE /api/todos/[id] endpoint. | app/api/todos/[id]/route.ts |
| api_validation_error | Server validation failed for a todo request (Zod error). | app/api/todos/[id]/route.ts |
| api_validation_error | Server validation failed for a todo creation request (Zod error). | app/api/todos/route.ts |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1796187
- Insight: https://us.posthog.com/project/483112/insights/NFcPt2Z7 (Todo creation over time)
- Insight: https://us.posthog.com/project/483112/insights/IeZBp7f2 (Todo lifecycle funnel)
- Insight: https://us.posthog.com/project/483112/insights/vEHXykrx (API health: validation errors)
- Insight: https://us.posthog.com/project/483112/insights/dgExQiEb (Server operations breakdown)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
