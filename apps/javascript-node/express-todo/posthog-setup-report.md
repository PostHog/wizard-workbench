<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Express todo API with PostHog analytics. The `posthog-node` SDK was installed and a PostHog client was initialized in `index.js` using environment variables (`POSTHOG_KEY` and `POSTHOG_HOST`). Capture calls were added to every mutating route handler, and an Express error-handling middleware was added to capture uncaught exceptions via `captureException`.

| Event | Description | File |
|---|---|---|
| `todo_created` | Fired when a new todo item is successfully created via POST /api/todos | `index.js` |
| `todo_updated` | Fired when a todo item is updated (title or completed status) via PATCH /api/todos/:id | `index.js` |
| `todo_completed` | Fired when a todo item is marked as completed via PATCH /api/todos/:id | `index.js` |
| `todo_deleted` | Fired when a todo item is deleted via DELETE /api/todos/:id | `index.js` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with the following suggested insights:

- **Todo creation trend** — Total count of `todo_created` events over time
- **Todo completion rate** — Ratio of `todo_completed` to `todo_created` events (funnel)
- **Todo deletion trend** — Total count of `todo_deleted` events over time
- **Update activity** — Total count of `todo_updated` events over time
- **Error rate** — Count of `$exception` events to track application errors

Visit your PostHog project at https://us.posthog.com/project/238460 to create this dashboard.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
