<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Express todo API. The `posthog-node` SDK (v5.28.0) was installed and initialized in `index.js` using environment variables for the project token and host. Three event capture calls were added to the route handlers that mutate data, a global Express error middleware was added to capture exceptions, and graceful shutdown handlers were wired up for SIGINT and SIGTERM.

| Event name | Description | File |
|---|---|---|
| `todo created` | A new todo item was created via POST /api/todos | `index.js` |
| `todo updated` | A todo item was updated (title or completed status) via PATCH /api/todos/:id | `index.js` |
| `todo deleted` | A todo item was deleted via DELETE /api/todos/:id | `index.js` |

## Next steps

To see your events in PostHog, open the **Events** tab in your PostHog project and filter for `todo created`, `todo updated`, and `todo deleted`. You can build insights such as:

- **Todo creation over time** — Trends chart of `todo created` events (daily)
- **Todo completion rate** — Funnel from `todo created` → `todo updated` (with `todo_completed = true`)
- **Todo deletion rate** — Trends chart of `todo deleted` events
- **Active users** — Unique users per day across all three todo events
- **Error rate** — Trends chart of `$exception` events captured via `captureException`

To correlate server-side events with client-side sessions, pass the PostHog distinct ID and session ID in request headers as `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` from your frontend.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
