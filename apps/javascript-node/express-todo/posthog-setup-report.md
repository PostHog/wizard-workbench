<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Express.js todo API. The `posthog-node` SDK was installed and initialized in `index.js` with `enableExceptionAutocapture: true`. Event capture calls were added to all three mutating route handlers (POST, PATCH, DELETE), an Express error-handling middleware was added to capture exceptions via `captureException`, and graceful shutdown handlers (`SIGINT`/`SIGTERM`) were added to flush pending events before process exit. The PostHog API key and host are loaded from environment variables set in `.env`.

| Event name | Description | File |
|---|---|---|
| `todo created` | A new todo item was successfully created | `index.js` |
| `todo updated` | An existing todo item was updated (title or completed status) | `index.js` |
| `todo deleted` | A todo item was deleted | `index.js` |

## Next steps

You can build insights in your PostHog project (https://us.i.posthog.com) using the events above. Suggested insights:

- **Todo creation trend** — trend chart on `todo created` over time
- **Todo completion rate** — funnel from `todo created` → `todo updated` (where `todo_completed = true`)
- **Todo deletion rate** — trend chart on `todo deleted` over time
- **Active users** — unique users across all three events
- **Error rate** — trend on `$exception` events captured by `captureException`

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
