<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Hono-based Node.js bookmark/link API.

## Summary of changes

**`index.js`** — The main application file was updated with:
- **PostHog initialization**: `posthog-node` is imported and a `PostHog` client is created using `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables, with `enableExceptionAutocapture: true`.
- **Per-request context middleware**: A Hono `app.use('*')` middleware wraps every request with `posthog.withContext()`, extracting a `distinctId` from the `X-PostHog-Distinct-ID` header (set by clients that use posthog-js), falling back to the forwarded IP. This ensures all server-side events are correlated with client-side sessions.
- **Event capture**: Five business events are captured across the API's mutation and query routes (see table below).
- **Error tracking**: `app.onError()` calls `posthog.captureException(err, distinctId)` to forward unhandled exceptions to PostHog error tracking.
- **Graceful shutdown**: A `SIGINT` handler calls `await posthog.shutdown()` to flush any queued events before the process exits.

**`.env`** — `POSTHOG_API_KEY` and `POSTHOG_HOST` were written to the project's `.env` file.

**`package.json`** — `posthog-node` was added as a dependency.

## Tracked events

| Event name | Description | File |
|---|---|---|
| `link_saved` | Fired when a user successfully saves a new link | `index.js` |
| `link_updated` | Fired when a user successfully updates an existing link's properties | `index.js` |
| `link_favorited` | Fired when a user toggles a link's favorite status to true | `index.js` |
| `link_deleted` | Fired when a user successfully deletes a link | `index.js` |
| `links_searched` | Fired when a user searches or filters links by tag, keyword, or favorites | `index.js` |

## Next steps

Build an "Analytics basics" dashboard in PostHog with these five insights to track the health and usage of your links API:

1. **Links saved over time** — Trends chart for `link_saved`, showing how many bookmarks users are creating each day.
   [Open in PostHog](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"link_saved","name":"link_saved","type":"events","order":0}],"display":"ActionsLineGraph","interval":"day"})

2. **Link save → update → delete funnel** — Conversion funnel showing the lifecycle of a bookmark from creation to deletion, surfacing churn patterns.
   [Open in PostHog](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"link_saved","name":"link_saved","type":"events","order":0},{"id":"link_updated","name":"link_updated","type":"events","order":1},{"id":"link_deleted","name":"link_deleted","type":"events","order":2}]})

3. **Link deletions over time** — Trends chart for `link_deleted`, a churn signal indicating when users remove bookmarks.
   [Open in PostHog](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"link_deleted","name":"link_deleted","type":"events","order":0}],"display":"ActionsLineGraph","interval":"day"})

4. **Links favorited** — Trends chart for `link_favorited`, tracking engagement with the favorites feature.
   [Open in PostHog](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"link_favorited","name":"link_favorited","type":"events","order":0}],"display":"ActionsLineGraph","interval":"day"})

5. **Search and filter usage** — Trends chart for `links_searched`, broken down by `tag`, `search`, and `favorites_only` properties to understand how users discover their bookmarks.
   [Open in PostHog](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"links_searched","name":"links_searched","type":"events","order":0}],"display":"ActionsLineGraph","interval":"day"})

To collect these into a dashboard, [create a new "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard/new) and add each insight above to it.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
