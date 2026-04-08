<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Express.js todo API. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. Capture calls were added to every mutating route handler (create, update, delete). An Express error middleware was added to send unhandled exceptions to PostHog via `captureException`. Graceful shutdown handlers for `SIGINT` and `SIGTERM` flush all pending events before the process exits. Frontend correlation is supported via the `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` request headers.

| Event name | Description | File |
|---|---|---|
| `todo created` | Fired when a new todo item is successfully created via `POST /api/todos` | `index.js` |
| `todo updated` | Fired when a todo item is successfully updated (title or completed status) via `PATCH /api/todos/:id` | `index.js` |
| `todo deleted` | Fired when a todo item is successfully deleted via `DELETE /api/todos/:id` | `index.js` |

## Next steps

To build insights and a dashboard for these events, visit your PostHog project and create an **"Analytics basics"** dashboard with insights like:

- **Todo creation trend** — Trends chart for `todo created` over time
- **Todo update trend** — Trends chart for `todo updated` over time
- **Todo deletion trend** — Trends chart for `todo deleted` over time
- **Todo lifecycle funnel** — Funnel from `todo created` → `todo updated` → `todo deleted`
- **Active users** — Unique users count across all todo events

You can navigate to your PostHog project at: **https://us.posthog.com/project/2**

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
