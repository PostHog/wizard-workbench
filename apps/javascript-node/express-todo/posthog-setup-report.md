<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Express todo API. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. Four business-critical events are now captured across the todo CRUD routes, with the caller's distinct ID read from the `X-PostHog-Distinct-ID` request header (falling back to `"anonymous"`). An Express error-handling middleware captures unhandled exceptions via `captureException`, and graceful shutdown handlers ensure all queued events are flushed before the process exits.

| Event | Description | File |
|---|---|---|
| `todo_created` | Fired when a new todo item is created via `POST /api/todos` | `index.js` |
| `todo_updated` | Fired when a todo item's title or completed status is changed via `PATCH /api/todos/:id` | `index.js` |
| `todo_completed` | Fired specifically when a todo's `completed` field transitions to `true` via `PATCH /api/todos/:id` | `index.js` |
| `todo_deleted` | Fired when a todo item is removed via `DELETE /api/todos/:id` | `index.js` |

## Next steps

We've prepared some suggested insights and a dashboard for you to keep an eye on user behavior based on the events we just instrumented. You can build these directly in PostHog:

- [Create a new dashboard named "Analytics basics"](https://us.posthog.com/project/2/dashboard/new)
- [Trend: Todo creations over time](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=[{"id":"todo_created","name":"todo_created","type":"events"}])
- [Funnel: Create → Complete conversion](https://us.posthog.com/project/2/insights/new?insight=FUNNELS&events=[{"id":"todo_created","name":"todo_created","type":"events"},{"id":"todo_completed","name":"todo_completed","type":"events"}])
- [Trend: Todo deletions over time](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=[{"id":"todo_deleted","name":"todo_deleted","type":"events"}])
- [Trend: Completions vs deletions](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=[{"id":"todo_completed","name":"todo_completed","type":"events"},{"id":"todo_deleted","name":"todo_deleted","type":"events"}])

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
