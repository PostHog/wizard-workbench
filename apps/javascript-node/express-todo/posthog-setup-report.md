<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Express Todo API with PostHog analytics. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. All four CRUD routes now emit structured analytics events, and a global Express error handler captures unexpected exceptions. The distinct ID is read from the `X-POSTHOG-DISTINCT-ID` request header (falling back to `"anonymous"`), allowing client-side and server-side events to be correlated. Environment variables are stored in `.env`.

| Event | Description | File |
|---|---|---|
| `todo created` | Fired when a new todo is created via `POST /api/todos` | `index.js` |
| `todo updated` | Fired when a todo's title or completion status is changed via `PATCH /api/todos/:id` | `index.js` |
| `todo completed` | Fired specifically when a todo transitions from incomplete → complete via `PATCH /api/todos/:id` | `index.js` |
| `todo deleted` | Fired when a todo is removed via `DELETE /api/todos/:id` | `index.js` |

## Next steps

To explore these events, open your PostHog project and use the **Insights** tab to build:

- **Trend**: `todo created` over time — tracks creation volume
- **Trend**: `todo completed` over time — tracks completion rate
- **Funnel**: `todo created` → `todo completed` — measures how many created todos get finished
- **Trend**: `todo deleted` over time — tracks churn / abandonment
- **User paths**: across all four events — shows typical user journeys

To correlate backend events with a frontend user session, send the PostHog `distinctId` and `sessionId` from your client as `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers on API requests.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
