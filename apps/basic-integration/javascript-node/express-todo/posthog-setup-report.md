# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Express Todo API. The `posthog-node` SDK was installed and initialized in `index.js` using environment variables for the API key and host. Event capture calls were added to all three mutating route handlers. An Express error middleware was added to capture unhandled exceptions, and graceful shutdown handlers ensure all buffered events are flushed before the process exits.

| Event | Description | File |
|---|---|---|
| `todo_created` | Fired when a new todo item is successfully created via `POST /api/todos` | `index.js` |
| `todo_updated` | Fired when a todo item is successfully updated via `PATCH /api/todos/:id` | `index.js` |
| `todo_deleted` | Fired when a todo item is successfully deleted via `DELETE /api/todos/:id` | `index.js` |

## Next steps

Build insights and a dashboard in PostHog to monitor these events:

- [Todo Events Over Time (Trends)](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"todo_created","name":"todo_created","type":"events"},{"id":"todo_updated","name":"todo_updated","type":"events"},{"id":"todo_deleted","name":"todo_deleted","type":"events"}]&date_from=-30d) — Line chart of all three todo events over the last 30 days
- [Todos Created (Total)](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"todo_created","name":"todo_created","type":"events"}]&display=BoldNumber&date_from=-30d) — Total count of todos created
- [Todo Action Breakdown](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"todo_created","name":"todo_created","type":"events"},{"id":"todo_updated","name":"todo_updated","type":"events"},{"id":"todo_deleted","name":"todo_deleted","type":"events"}]&display=ActionsPie&date_from=-30d) — Pie chart of create vs update vs delete actions
- [Create → Update → Delete Funnel](https://us.posthog.com/project/2/insights/new#insight=FUNNELS&events=[{"id":"todo_created","name":"todo_created","type":"events"},{"id":"todo_updated","name":"todo_updated","type":"events"},{"id":"todo_deleted","name":"todo_deleted","type":"events"}]&date_from=-30d) — Funnel from creation through completion lifecycle
- [Dashboard: Analytics basics](https://us.posthog.com/project/2/dashboards) — Create a new dashboard and add the above insights to it

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
