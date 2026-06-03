<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Express Todo API. The `posthog-node` SDK was installed and a PostHog client was initialized in `index.js` using environment variables (`POSTHOG_API_KEY` and `POSTHOG_HOST`). Event capture calls were added to every mutating route handler (create, update, complete, delete), an Express error-handling middleware was added to automatically report uncaught errors via `captureException`, and graceful shutdown handlers ensure all buffered events are flushed when the server stops.

A `getDistinctId` helper reads the `X-POSTHOG-DISTINCT-ID` request header (set by the frontend) so that server-side events can be correlated with client-side sessions. When no header is present it falls back to `'anonymous'`.

| Event name | Description | File |
|---|---|---|
| `todo created` | A new todo item was successfully created via POST /api/todos | `index.js` |
| `todo updated` | An existing todo item was updated (title or completion status) via PATCH /api/todos/:id | `index.js` |
| `todo completed` | A todo item was marked as completed via PATCH /api/todos/:id | `index.js` |
| `todo deleted` | A todo item was deleted via DELETE /api/todos/:id | `index.js` |

## Next steps

The PostHog MCP dashboard-creation tools require additional API scopes (`dashboard:write`, `query:read`, `insight:write`) that were not available during this session. To build a dashboard manually, visit [PostHog Dashboards](/dashboard) and create insights using these event names:

- **Todo creation rate** — Trends of `todo created` over time
- **Todo completion funnel** — Funnel from `todo created` → `todo completed`
- **Todo deletion rate** — Trends of `todo deleted` over time
- **Update vs completion breakdown** — `todo updated` broken down by `todo_completed` property

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
