<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Express.js todo API. The `posthog-node` SDK was installed and a PostHog client instance was initialized in `index.js` with `enableExceptionAutocapture: true`. Capture calls were added to all three mutating route handlers (`POST /api/todos`, `PATCH /api/todos/:id`, `DELETE /api/todos/:id`). An Express error-handling middleware was added to capture unhandled exceptions with `captureException`. Graceful shutdown via `posthog.shutdown()` is called on both `SIGINT` and `SIGTERM`. The distinct ID is read from the `X-POSTHOG-DISTINCT-ID` request header so client-side sessions can be correlated with server-side events, and `$session_id` is forwarded via the `X-POSTHOG-SESSION-ID` header. PostHog credentials are stored in `.env` and referenced via `process.env`.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | Fired when a new todo is successfully created via POST /api/todos | `index.js` |
| `todo_updated` | Fired when a todo's title or completion status is changed via PATCH /api/todos/:id | `index.js` |
| `todo_completed` | Fired when a todo is marked as completed (completed transitions from false → true) | `index.js` |
| `todo_deleted` | Fired when a todo is deleted via DELETE /api/todos/:id | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented. Visit your PostHog project to create an "Analytics basics" dashboard with these recommended insights:

- [Todos created over time (Trends)](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"todo_created","type":"events"}],"display":"ActionsLineGraph","insight":"TRENDS"})
- [Todo completion funnel: created → completed (Funnel)](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"todo_created","type":"events","order":0},{"id":"todo_completed","type":"events","order":1}]})
- [Todo deletions over time (Trends)](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"todo_deleted","type":"events"}],"display":"ActionsLineGraph","insight":"TRENDS"})
- [All todo actions breakdown (Trends)](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"todo_created","type":"events"},{"id":"todo_updated","type":"events"},{"id":"todo_completed","type":"events"},{"id":"todo_deleted","type":"events"}],"display":"ActionsLineGraph","insight":"TRENDS"})
- [Active users performing todo actions (Trends)](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"todo_created","type":"events"},{"id":"todo_completed","type":"events"},{"id":"todo_deleted","type":"events"}],"display":"ActionsLineGraph","insight":"TRENDS","breakdown":"$distinct_id","breakdown_type":"event"})

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
