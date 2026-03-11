<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Express Todo API. The `posthog-node` SDK was installed and a PostHog client was initialized in `index.js` with `enableExceptionAutocapture: true`. Event capture calls were added to all three write routes (`POST`, `PATCH`, `DELETE`), an Express error middleware was added to capture unhandled exceptions via `captureException`, and graceful shutdown handlers (`SIGINT`/`SIGTERM`) ensure all queued events are flushed before the process exits. Distinct IDs are read from the `X-POSTHOG-DISTINCT-ID` request header, allowing frontend clients to correlate their events with server-side events.

| Event Name | Description | File |
|---|---|---|
| `todo created` | Fired when a new todo item is successfully created via `POST /api/todos`. Properties: `todo_id`, `todo_title`. | `index.js` |
| `todo updated` | Fired when a todo item is successfully updated via `PATCH /api/todos/:id`. Properties: `todo_id`, `todo_title`, `todo_completed`. | `index.js` |
| `todo deleted` | Fired when a todo item is successfully deleted via `DELETE /api/todos/:id`. Properties: `todo_id`. | `index.js` |

## Next steps

We've prepared the insights you should build for your "Analytics basics" dashboard. Create it in PostHog and add these insights to keep an eye on user behavior:

- **Todos created over time** — Trend insight for the `todo created` event. Tracks overall creation volume and growth.
- **Todo completion rate** — Trend insight filtering `todo updated` where `todo_completed = true` vs. total updates. Reveals how often users complete tasks.
- **Todos deleted over time** — Trend insight for the `todo deleted` event. High deletion rate relative to creation can signal churn or poor task quality.
- **Todo lifecycle funnel** — Funnel insight: `todo created` → `todo updated` → `todo deleted`. Shows how many todos go through the full lifecycle.
- **Unique active users** — Trend insight with `Unique users` aggregation across all three events. Measures daily/weekly active users of the API.

Create your dashboard at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
