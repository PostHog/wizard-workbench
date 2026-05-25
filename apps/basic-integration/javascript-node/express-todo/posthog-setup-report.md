<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Express Todo API with PostHog analytics. The `posthog-node` SDK was installed and initialized in `index.js` using environment variables for the API key and host. Event tracking was added to all four CRUD route handlers (create, update, complete, delete), an Express error middleware was added to capture exceptions via `posthog.captureException()`, and a graceful shutdown handler was added to flush any pending events before the process exits. A `getDistinctId` helper reads the `X-POSTHOG-DISTINCT-ID` header (for correlation with a frontend client) and falls back to `req.ip`.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user creates a new todo item via POST /api/todos | `index.js` |
| `todo_completed` | Fired when a user marks a todo as completed via PATCH /api/todos/:id with completed=true | `index.js` |
| `todo_updated` | Fired when a user updates a todo's title via PATCH /api/todos/:id | `index.js` |
| `todo_deleted` | Fired when a user deletes a todo item via DELETE /api/todos/:id | `index.js` |

## Next steps

We've identified an existing "Analytics basics" dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1053460)

Suggested insights to add to the dashboard:
- **Todo creation rate** — trends over time for `todo_created`
- **Todo completion rate** — trends over time for `todo_completed` vs `todo_created`
- **Todo deletion rate** — trends over time for `todo_deleted`
- **Completion funnel** — funnel from `todo_created` → `todo_completed`
- **Error rate** — trends over time for `$exception` events

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
