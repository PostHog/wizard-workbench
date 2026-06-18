# PostHog post-wizard report

The wizard has completed a deep integration of the Express Todo API with PostHog analytics. A PostHog client was initialised in `index.js` using environment variables for the token and host. The `setupExpressRequestContext` middleware was registered before all routes so every request automatically gets `$current_url`, `$request_method`, `$request_path`, `$user_agent`, and `$ip` added as event properties. The `setupExpressErrorHandler` middleware was registered after all routes to capture unhandled Express errors. Capture calls were added to the three write routes (POST, PATCH, DELETE) covering todo creation, title updates, completion, and deletion.

| Event name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user creates a new todo item via the POST /api/todos endpoint. | index.js |
| `todo_updated` | Fired when a user updates a todo item's title via the PATCH /api/todos/:id endpoint. | index.js |
| `todo_completed` | Fired when a user marks a todo item as completed via the PATCH /api/todos/:id endpoint. | index.js |
| `todo_deleted` | Fired when a user deletes a todo item via the DELETE /api/todos/:id endpoint. | index.js |

## Next steps

Dashboard creation was not possible during this run (the API key is missing `dashboard:write` and `insight:write` scopes). You can create the "Analytics basics (wizard)" dashboard manually:

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard) — create a new dashboard and add trend insights for `todo_created`, `todo_completed`, `todo_deleted`, and a ratio of completed vs created todos.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
