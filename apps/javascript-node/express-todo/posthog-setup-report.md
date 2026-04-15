<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Express.js Todo API. The `posthog-node` SDK has been initialized in `index.js` with environment variable–based configuration, exception autocapture enabled, and graceful shutdown on process exit. Event tracking has been added to all mutation routes, and error tracking is wired into Express's error-handling middleware.

| Event name | Description | File |
|---|---|---|
| `todo created` | Fired when a new todo is successfully created via `POST /api/todos` | `index.js` |
| `todo updated` | Fired when a todo's title or completed status is changed via `PATCH /api/todos/:id` | `index.js` |
| `todo completed` | Fired specifically when a todo's `completed` field is set to `true` | `index.js` |
| `todo deleted` | Fired when a todo is deleted via `DELETE /api/todos/:id` | `index.js` |

Each event includes contextual properties (`todo_id`, `title`, `completed`) and uses the `X-POSTHOG-DISTINCT-ID` request header as the distinct ID, falling back to the client IP.

## Next steps

We were unable to automatically create the dashboard due to API key scope restrictions. To set up your "Analytics basics" dashboard in PostHog, create a new dashboard and add the following five insights:

1. **Todo creation trend** — Trends chart for `todo created` over time (daily). Tracks new task volume.
2. **Todo completion rate** — Formula insight: unique users of `todo completed` ÷ unique users of `todo created`. Shows what fraction of created todos get finished.
3. **Creation → Completion funnel** — Funnel from `todo created` → `todo completed`. Visualises the conversion rate.
4. **Todo deletions over time** — Trends chart for `todo deleted` (daily). Helps spot churn or cleanup patterns.
5. **Active users by action** — Stacked trends chart comparing unique users for `todo created`, `todo updated`, and `todo deleted`. Shows overall engagement levels.

You can create your dashboard at: [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
