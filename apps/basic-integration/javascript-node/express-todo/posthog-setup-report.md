<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Express todo API with PostHog analytics. The `posthog-node` SDK was installed and a client instance was initialized in `index.js` using environment variables for the API key and host. Event capture calls were added to every mutating route handler (create, update, delete), an Express error middleware was wired up to forward unhandled exceptions to PostHog via `captureException`, and graceful shutdown handlers ensure all queued events are flushed when the process exits. Client-side correlation is supported: if a frontend sends `X-PostHog-Distinct-ID` and `X-PostHog-Session-ID` request headers, those values are forwarded as the `distinctId` and `$session_id` on each server-side event.

| Event | Description | File |
|---|---|---|
| `todo created` | Fired when a new todo item is created via `POST /api/todos`. Includes `todo_id` and `todo_title`. | `index.js` |
| `todo updated` | Fired when an existing todo is modified via `PATCH /api/todos/:id`. Includes `todo_id`, `todo_title`, and `todo_completed`. | `index.js` |
| `todo deleted` | Fired when a todo is removed via `DELETE /api/todos/:id`. Includes `todo_id` and `todo_title`. | `index.js` |

## Next steps

We've configured event capture for the key user actions in your todo API. Head to your PostHog project to build insights and dashboards based on these events:

- [PostHog Dashboards](/dashboard) — create an "Analytics basics" dashboard with trend charts for `todo created`, `todo updated`, and `todo deleted`
- [Insights](/insights) — build a trends insight to see how todo creation volume changes over time
- [Events explorer](/events) — inspect individual captured events and their properties in real time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
