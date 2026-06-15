# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Express.js todo API. The `posthog-node` SDK was installed and a singleton PostHog client was added to `index.js`, initialized via environment variables. Four business events are now tracked across the todo CRUD routes, and an Express error middleware captures unhandled exceptions via `captureException`. A graceful shutdown handler flushes pending events on `SIGINT`.

| Event | Description | File |
|-------|-------------|------|
| `todo created` | Fired when a user successfully creates a new todo item via `POST /api/todos` | `index.js` |
| `todo updated` | Fired when a user updates the title of a todo via `PATCH /api/todos/:id` | `index.js` |
| `todo completed` | Fired when a user marks a todo as completed/uncompleted via `PATCH /api/todos/:id` | `index.js` |
| `todo deleted` | Fired when a user deletes a todo via `DELETE /api/todos/:id` | `index.js` |

## Next steps

A dashboard could not be created automatically because the current API key is missing the `dashboard:write`, `query:read`, and `insight:write` scopes. You can create one manually at:

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard) — create a new dashboard named **"Analytics basics (wizard)"** and add trend insights for each of the four events above.

Suggested insights to add:
1. **Todo creation trend** — `todo created` over time
2. **Todo completion rate** — `todo completed` (completed=true) over time
3. **Todo update activity** — `todo updated` over time
4. **Todo deletion trend** — `todo deleted` over time
5. **Error rate** — `$exception` events over time

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
