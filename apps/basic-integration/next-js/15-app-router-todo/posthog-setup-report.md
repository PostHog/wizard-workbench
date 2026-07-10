<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was added to this Next.js App Router todo application with client-side initialization through `instrumentation-client.ts`, a reverse proxy in `next.config.ts`, and a reusable server-side client for API route capture and exception reporting. The todo UI now captures key user interactions for loading the list, submitting creation, toggling completion, and initiating deletion, while the server API captures successful create/update/delete operations plus validation and server errors. Environment variables were written to `.env.local`, the SDK packages were installed with pnpm, and a production build completed successfully after the integration.

| Event name | Description | File |
| --- | --- | --- |
| `todo_list_loaded` | Captures when the main todo list successfully loads with summary counts. | `components/todos/todo-list.tsx` |
| `todo_create_submitted` | Captures when a user submits the form to create a new todo. | `components/todos/todo-form.tsx` |
| `todo_completion_toggled` | Captures when a user marks a todo complete or incomplete. | `components/todos/todo-item.tsx` |
| `todo_delete_clicked` | Captures when a user clicks the delete control for a todo item. | `components/todos/todo-item.tsx` |
| `todo_collection_fetched` | Captures when the server returns the todo collection with summary counts. | `app/api/todos/route.ts` |
| `todo_created` | Captures when the server successfully creates a todo item. | `app/api/todos/route.ts` |
| `todo_updated` | Captures when the server successfully updates a todo item. | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Captures when the server successfully deletes a todo item. | `app/api/todos/[id]/route.ts` |
| `todo_api_error` | Captures server-side todo API failures and validation errors. | `app/api/todos/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1831057)
- [Todos created (wizard)](https://us.posthog.com/project/483112/insights/pL9ebIWe)
- [Todo updates vs deletes (wizard)](https://us.posthog.com/project/483112/insights/K1GD1S9j)
- [Todo create funnel (wizard)](https://us.posthog.com/project/483112/insights/jmLUXClP)
- [Todo completion toggles (wizard)](https://us.posthog.com/project/483112/insights/rnj46IeB)
- [Todo API errors (wizard)](https://us.posthog.com/project/483112/insights/n3vsCxEx)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
