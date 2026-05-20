<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Express Todo API. The `posthog-node` SDK was installed and configured in `index.js` with environment-variable-based credentials. Event capture calls were added to all mutating routes, a graceful shutdown handler was added for process exit, and Express error middleware was wired to `captureException` for automatic error tracking.

The distinct ID for each event is resolved from the `X-POSTHOG-DISTINCT-ID` request header (set by frontend clients to correlate server-side events with client-side sessions) and falls back to the client IP address. The PostHog session ID is forwarded via the `X-POSTHOG-SESSION-ID` header so events can be linked to session recordings.

| Event name | Description | File |
|---|---|---|
| `todo created` | A new todo item was created via `POST /api/todos` | `index.js` |
| `todo updated` | A todo's title or completed status was updated via `PATCH /api/todos/:id` | `index.js` |
| `todo completed` | A todo was marked as completed (fired in addition to `todo updated`) via `PATCH /api/todos/:id` | `index.js` |
| `todo deleted` | A todo was deleted via `DELETE /api/todos/:id` | `index.js` |

## Next steps

We've suggested some insights below for you to build a dashboard. Head to your project and create a new **"Analytics basics"** dashboard, then add these insights:

- [Todo creation trend](https://us.posthog.com/project/2/insights/new#insight=TRENDS) — Trends insight filtered to `todo created` to track new todo volume over time
- [Todo completion funnel](https://us.posthog.com/project/2/insights/new#insight=FUNNELS) — Funnel from `todo created` → `todo completed` to measure how many created todos are completed
- [Todo churn (deletions)](https://us.posthog.com/project/2/insights/new#insight=TRENDS) — Trends insight filtered to `todo deleted` to monitor deletion rate
- [Todo activity breakdown](https://us.posthog.com/project/2/insights/new#insight=TRENDS) — Trends with all four events (`todo created`, `todo updated`, `todo completed`, `todo deleted`) to see overall usage patterns
- [Error rate](https://us.posthog.com/project/2/insights/new#insight=TRENDS) — Trends filtered to `$exception` to track server errors captured by the Express error middleware

[View all dashboards →](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
