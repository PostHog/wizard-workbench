<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Express.js todo API. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. Event tracking was added to all three data-mutating routes (create, update, delete). An Express error middleware was added to capture unhandled exceptions via `captureException`. Graceful shutdown on `SIGINT` ensures all batched events are flushed before the process exits. PostHog credentials are stored in `.env` and referenced via environment variables — no secrets are hardcoded.

| Event | Description | File |
|---|---|---|
| `todo_created` | A new todo item was created | `index.js` |
| `todo_updated` | An existing todo item was updated (title or completed status) | `index.js` |
| `todo_deleted` | A todo item was deleted | `index.js` |

## Next steps

We attempted to build an "Analytics basics" dashboard in PostHog for these events, but the configured API key has read-only scopes. To create the dashboard manually, visit your PostHog project and build insights for:

- **Todo creation trend** — trend of `todo_created` over time
- **Todo deletion trend** — trend of `todo_deleted` over time
- **Create vs delete comparison** — `todo_created` vs `todo_deleted` counts
- **Active users** — unique users firing `todo_created`
- **Update activity** — trend of `todo_updated` over time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
