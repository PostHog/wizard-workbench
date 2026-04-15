<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Express Todo API with PostHog analytics. The `posthog-node` SDK was installed and initialized in `index.js` with your project API key and host loaded from environment variables. Event capture calls were added to every mutating route handler (`POST`, `PATCH`, `DELETE`), and an Express error middleware was added to capture unhandled exceptions via `posthog.captureException()`. The distinct ID for each event is read from the `X-POSTHOG-DISTINCT-ID` request header (for frontend correlation), falling back to `req.ip`, then `'anonymous'`.

| Event name | Description | File |
|---|---|---|
| `todo created` | Fired when a new todo is successfully created via `POST /api/todos` | `index.js` |
| `todo updated` | Fired when an existing todo is updated via `PATCH /api/todos/:id` | `index.js` |
| `todo deleted` | Fired when a todo is deleted via `DELETE /api/todos/:id` | `index.js` |

## Next steps

We've prepared insights for you to add to an **Analytics basics** dashboard. Create the dashboard and add these insights to monitor todo activity:

- [Create new dashboard](https://us.posthog.com/project/2/dashboard/new) — name it "Analytics basics"
- [Todo creations over time](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo created","type":"events","order":0}],"date_from":"-30d"}) — trend of `todo created`
- [Todo updates over time](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo updated","type":"events","order":0}],"date_from":"-30d"}) — trend of `todo updated`
- [Todo deletions over time](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo deleted","type":"events","order":0}],"date_from":"-30d"}) — trend of `todo deleted`
- [All todo events combined](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo created","type":"events","order":0},{"id":"todo updated","type":"events","order":1},{"id":"todo deleted","type":"events","order":2}],"date_from":"-30d"}) — compare all three events on one chart
- [Todo lifecycle funnel](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"todo created","type":"events","order":0},{"id":"todo updated","type":"events","order":1},{"id":"todo deleted","type":"events","order":2}],"date_from":"-30d"}) — conversion from creation → update → deletion

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
