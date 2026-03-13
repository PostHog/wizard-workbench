<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog analytics have been added to the Express todo API (`index.js`). The `posthog-node` SDK (v5.28.2) was installed and initialized with environment variables for the API key and host. Event capture calls were added to all three data-mutating route handlers (POST, PATCH, DELETE), and an Express error middleware was added to capture exceptions via `captureException`. Each event carries contextual properties (todo ID, title, completion state) and supports frontend correlation via `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` request headers. A graceful shutdown handler ensures all queued events are flushed when the server exits.

| Event | Description | File |
|-------|-------------|------|
| `todo created` | A new todo item was successfully created via POST /api/todos | `index.js` |
| `todo completed` | A todo item was marked as completed via PATCH /api/todos/:id with completed=true | `index.js` |
| `todo updated` | A todo item's title was changed via PATCH /api/todos/:id | `index.js` |
| `todo deleted` | A todo item was deleted via DELETE /api/todos/:id | `index.js` |

## Next steps

To build analytics and dashboards based on these events, visit your PostHog project and create a dashboard named **"Analytics basics"** with the following suggested insights:

- **Todo creation trend** – Total `todo created` events over time (line chart) — tracks adoption and usage growth
- **Todo completion rate** – `todo completed` / `todo created` as a funnel — key conversion metric
- **Todo deletion rate** – Total `todo deleted` events over time — potential churn signal
- **Todo lifecycle funnel** – Funnel: `todo created` → `todo completed` or `todo deleted` — shows full item lifecycle
- **Active users** – Unique `distinctId` values across all todo events — tracks unique API consumers

Dashboard: https://us.posthog.com/project/2

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
