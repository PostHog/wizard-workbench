<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Express Todo API. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. Event tracking was added to every mutating route handler, an Express error middleware was wired up with `captureException` for error tracking, and a graceful SIGTERM shutdown handler flushes any queued events before the process exits. Client-provided `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers are forwarded on every event to allow correlation with frontend sessions. Environment variables are used for all PostHog configuration — no tokens are hardcoded.

| Event name | Description | File |
|---|---|---|
| `todo created` | Fired when a user successfully creates a new todo item | `index.js` |
| `todo updated` | Fired when a user updates an existing todo item's title or completion status | `index.js` |
| `todo deleted` | Fired when a user deletes a todo item | `index.js` |

## Next steps

We've outlined five insights for your "Analytics basics" dashboard. Create them in PostHog and add them to a new dashboard for a live view of user behavior:

- [Todo Created Over Time — trend of `todo created` events over the last 30 days](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo created","name":"todo created","type":"events","order":0}]})
- [Todo Updated Over Time — trend of `todo updated` events over the last 30 days](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo updated","name":"todo updated","type":"events","order":0}]})
- [Todo Deleted Over Time — trend of `todo deleted` events over the last 30 days](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo deleted","name":"todo deleted","type":"events","order":0}]})
- [Todo Actions Breakdown — stacked bar of all three events to compare volume](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo created","name":"todo created","type":"events","order":0},{"id":"todo updated","name":"todo updated","type":"events","order":1},{"id":"todo deleted","name":"todo deleted","type":"events","order":2}],"display":"ActionsBar"})
- [Todo Creation to Deletion Funnel — conversion from `todo created` → `todo deleted`](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"todo created","name":"todo created","type":"events","order":0},{"id":"todo deleted","name":"todo deleted","type":"events","order":1}]})

Create your dashboard at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
