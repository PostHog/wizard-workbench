<wizard-report>
# PostHog post-wizard report

The wizard has integrated PostHog into the Next.js 15 Pages Router todo app. Client analytics initializes via instrumentation-client.ts, server analytics via a singleton posthog-node helper. Key client and server actions are captured with consistent snake_case events. A dashboard with trends and a funnel was created.

| Event name | Description | File |
| --- | --- | --- |
| todo_created | A user creates a new todo item from the form. | components/todos/todo-form.tsx |
| todo_completed_toggled | A user toggles the completed status of a todo item. | components/todos/todo-item.tsx |
| todo_deleted | A user deletes a todo item from the list. | components/todos/todo-item.tsx |
| todos_loaded | The list of todos is successfully fetched and displayed to the user. | components/todos/todo-list.tsx |
| todo_create_failed | Creating a new todo item failed due to a client or server error. | components/todos/todo-list.tsx |
| todo_update_failed | Updating a todo item failed due to a client or server error. | components/todos/todo-list.tsx |
| todo_delete_failed | Deleting a todo item failed due to a client or server error. | components/todos/todo-list.tsx |
| api_todo_created | Server-side event when a new todo is created via API. | pages/api/todos/index.ts |
| api_todo_updated | Server-side event when an existing todo is updated via API. | pages/api/todos/[id].ts |
| api_todo_deleted | Server-side event when a todo is deleted via API. | pages/api/todos/[id].ts |

## Next steps

We've built some insights and a dashboard for monitoring behavior:

- Dashboard: Analytics basics (wizard)
- Insight: Client: todo_created over time
- Insight: Client: completion toggles vs deletions
- Insight: Server: API create/update/delete volume
- Insight: Funnel: load → create → complete

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
