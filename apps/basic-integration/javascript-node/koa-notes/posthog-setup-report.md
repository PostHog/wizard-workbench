<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog analytics have been added to the Koa notes API (`index.js`). The `posthog-node` SDK is initialized at startup using environment variables and captures meaningful user actions across all mutating API routes. An error handler hooks into Koa's `app.on('error')` event to forward uncaught exceptions to PostHog error tracking. Graceful shutdown on `SIGINT` flushes any pending events before the process exits.

| Event name | Description | File |
|---|---|---|
| `note created` | Fired when a user successfully creates a new note via POST /api/notes | index.js |
| `note updated` | Fired when a user successfully updates an existing note via PATCH /api/notes/:id | index.js |
| `note deleted` | Fired when a user successfully deletes a note via DELETE /api/notes/:id | index.js |
| `folder created` | Fired when a user successfully creates a new folder via POST /api/folders | index.js |
| `folder deleted` | Fired when a user successfully deletes a folder via DELETE /api/folders/:id | index.js |
| `notes searched` | Fired when a user performs a text search on notes via GET /api/notes?search=... | index.js |

## Next steps

To build an "Analytics basics" dashboard, navigate to PostHog and create a new dashboard with the following suggested insights:

- **Notes created over time** — Trends chart for `note created`
- **Folders created over time** — Trends chart for `folder created`
- **Notes deleted vs created** — Trends chart comparing `note created` and `note deleted` to track churn
- **Search usage** — Trends chart for `notes searched` to understand how often users rely on search
- **Note updates over time** — Trends chart for `note updated` to measure engagement depth

You can access PostHog at [/insights](/insights) and [/dashboard](/dashboard).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
