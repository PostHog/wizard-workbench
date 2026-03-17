<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Express Todo API. The `posthog-node` SDK was installed, initialized in `index.js` using environment variables, and event tracking was added to all mutating API routes. An Express error middleware was added to automatically capture exceptions via `posthog.captureException()`, and graceful shutdown handlers ensure all queued events are flushed when the process exits.

| Event | Description | File |
|---|---|---|
| `todo created` | Fired when a user successfully creates a new todo item | `index.js` |
| `todo updated` | Fired when a user successfully updates an existing todo item (title or completed status) | `index.js` |
| `todo deleted` | Fired when a user successfully deletes a todo item | `index.js` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with the following insights:

- **Todo creation rate** — Trend of `todo created` events over time (shows how actively users create todos)
- **Todo completion funnel** — Funnel from `todo created` → `todo updated` (with `completed: true`) to track what fraction of todos get completed
- **Todo deletion rate** — Trend of `todo deleted` events over time (a high deletion rate may signal churn)
- **Unique active users** — Unique users by `distinctId` across all todo events
- **Error rate** — Trend of `$exception` events to monitor application health

You can create this dashboard at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
