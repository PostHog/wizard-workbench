<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of the Express todo API with PostHog analytics. The `posthog-node` SDK has been installed and initialized in `index.js` with environment-variable-based configuration. All four todo CRUD operations now emit PostHog events, and a global Express error handler captures unhandled exceptions with `captureException`. A `SIGINT` handler ensures the SDK shuts down cleanly so no queued events are lost.

The distinct ID is resolved from the `X-POSTHOG-DISTINCT-ID` request header (for frontend correlation), falling back to the client IP address, then `"anonymous"`.

| Event | Description | File |
|---|---|---|
| `todo created` | Fired when a new todo is successfully created via POST /api/todos | `index.js` |
| `todo updated` | Fired when an existing todo's title is changed via PATCH /api/todos/:id | `index.js` |
| `todo completed` | Fired when a todo is marked as completed via PATCH /api/todos/:id | `index.js` |
| `todo deleted` | Fired when a todo is deleted via DELETE /api/todos/:id | `index.js` |

## Next steps

Head to your PostHog project to explore the captured events and build insights. Here are some recommended charts to create in the [PostHog Insights view](/insights):

- **Todo creation trend** — Trends chart of `todo created` over time to track creation volume
- **Completion rate funnel** — Funnel from `todo created` → `todo completed` to measure completion rate
- **Deletion rate** — Trends chart of `todo deleted` to monitor churn (abandoned todos)
- **Edit frequency** — Trends chart of `todo updated` to see how often users revise their todos
- **Error rate** — Trends chart of `$exception` events to track server-side errors

You can also view all events in the [Live Events feed](/events).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
