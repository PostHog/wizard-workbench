<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the Express todo API. The `posthog-node` SDK was installed and the PostHog client was initialized in `index.js` using environment variables. Event capture calls were added to all three data-mutating route handlers (`POST`, `PATCH`, and `DELETE`). An Express error-handling middleware was added to capture exceptions via `posthog.captureException()`. Graceful shutdown hooks (`SIGINT`/`SIGTERM`) ensure all buffered events are flushed before the process exits. A `.env` file was created with the PostHog project token and host.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | Fired when a new todo item is successfully created via `POST /api/todos` | `index.js` |
| `todo_updated` | Fired when a todo item is updated via `PATCH /api/todos/:id`. Includes the updated title and `todo_completed` flag. | `index.js` |
| `todo_deleted` | Fired when a todo item is deleted via `DELETE /api/todos/:id` | `index.js` |

## Next steps

We've prepared an "Analytics basics" dashboard for you to keep an eye on user behavior. Visit PostHog to create it from the insights below:

- **[Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboards)**

Suggested insights to add to the dashboard:

- **[Todo creations over time](https://us.posthog.com/project/2/insights/new#insight=TRENDS&interval=day&events=[{"id":"todo_created","name":"todo_created","type":"events","order":0}])** — Daily trend of `todo_created` events
- **[Todo completions over time](https://us.posthog.com/project/2/insights/new#insight=TRENDS&interval=day&events=[{"id":"todo_updated","name":"todo_updated","type":"events","order":0,"properties":[{"key":"todo_completed","value":["true"],"operator":"exact","type":"event"}]}])** — `todo_updated` events filtered to `todo_completed = true`
- **[Todo deletions over time](https://us.posthog.com/project/2/insights/new#insight=TRENDS&interval=day&events=[{"id":"todo_deleted","name":"todo_deleted","type":"events","order":0}])** — Daily trend of `todo_deleted` events
- **[All todo activity](https://us.posthog.com/project/2/insights/new#insight=TRENDS&interval=day&events=[{"id":"todo_created","name":"todo_created","type":"events","order":0},{"id":"todo_updated","name":"todo_updated","type":"events","order":1},{"id":"todo_deleted","name":"todo_deleted","type":"events","order":2}])** — Stacked trend of all three events together
- **[Create → Complete funnel](https://us.posthog.com/project/2/insights/new#insight=FUNNELS&events=[{"id":"todo_created","name":"todo_created","type":"events","order":0},{"id":"todo_updated","name":"todo_updated","type":"events","order":1,"properties":[{"key":"todo_completed","value":["true"],"operator":"exact","type":"event"}]}])** — Conversion funnel from todo creation to completion

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
