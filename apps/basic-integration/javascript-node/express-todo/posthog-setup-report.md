<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Express todo API. The `posthog-node` SDK was installed and initialized in `index.js` with `enableExceptionAutocapture: true`. Event capture calls were added to every mutating route handler, an Express error middleware was added to report unhandled exceptions via `captureException`, and a graceful shutdown handler ensures queued events are flushed on process exit. The distinct ID is read from the `X-POSTHOG-DISTINCT-ID` request header on every request, falling back to `'anonymous'` if not provided — pass this header from your frontend to correlate server-side events with client-side sessions.

| Event | Description | File |
|-------|-------------|------|
| `todo created` | Fired when a new todo item is successfully created via `POST /api/todos` | `index.js` |
| `todo updated` | Fired when an existing todo's title or completed status is updated via `PATCH /api/todos/:id` | `index.js` |
| `todo completed` | Fired specifically when a todo's `completed` flag is set to `true` via `PATCH /api/todos/:id` | `index.js` |
| `todo deleted` | Fired when a todo item is successfully deleted via `DELETE /api/todos/:id` | `index.js` |

## Next steps

We've prepared an "Analytics basics" dashboard for you to keep an eye on user behaviour. Create it in PostHog using the links below:

- **Dashboard** – [Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard) — click **New dashboard**, name it "Analytics basics", then add the insights below.
- **Insight 1 – Todo creations over time** – [New trend insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo created","name":"todo created","type":"events","order":0}],"date_from":"-30d"}) — trend of `todo created` over the last 30 days.
- **Insight 2 – Todo completions over time** – [New trend insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo completed","name":"todo completed","type":"events","order":0}],"date_from":"-30d"}) — trend of `todo completed` over the last 30 days.
- **Insight 3 – Todo deletions over time** – [New trend insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo deleted","name":"todo deleted","type":"events","order":0}],"date_from":"-30d"}) — trend of `todo deleted` over the last 30 days.
- **Insight 4 – Todo lifecycle funnel** – [New funnel insight](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"todo created","name":"todo created","type":"events","order":0},{"id":"todo completed","name":"todo completed","type":"events","order":1}],"date_from":"-30d"}) — conversion funnel from `todo created` → `todo completed`.
- **Insight 5 – All todo actions breakdown** – [New trend insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo created","name":"todo created","type":"events","order":0},{"id":"todo updated","name":"todo updated","type":"events","order":1},{"id":"todo completed","name":"todo completed","type":"events","order":2},{"id":"todo deleted","name":"todo deleted","type":"events","order":3}],"date_from":"-30d"}) — all four events on a single chart for a complete activity overview.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
