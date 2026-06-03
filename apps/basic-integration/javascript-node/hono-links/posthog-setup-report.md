<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Hono.js bookmark/link saver API with PostHog analytics. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. A `getDistinctId` helper reads the `x-posthog-distinct-id` request header to identify callers, defaulting to `'anonymous'`. Event capture calls were added to every data-mutation route, a `link favorited` event fires separately when a link's favorite status transitions to `true`, and `links searched` fires whenever any filter query parameter is present. Hono's `app.onError` handler routes all unhandled exceptions through `posthog.captureException`. Graceful shutdown is wired to `SIGINT` and `SIGTERM` so queued events are always flushed before the process exits.

| Event | Description | File |
|-------|-------------|------|
| `link saved` | Fired when a user successfully saves a new bookmark link | index.js |
| `link updated` | Fired when a user updates an existing bookmark link's properties | index.js |
| `link deleted` | Fired when a user deletes a bookmark link | index.js |
| `link favorited` | Fired when a user marks a link as a favorite | index.js |
| `links searched` | Fired when a user searches or filters links by tag, keyword, or favorites | index.js |

## Next steps

We've prepared a set of insights to build in PostHog to keep an eye on user behavior, based on the events just instrumented. Visit the links below to create each one manually in your project:

- [New dashboard — "Analytics basics"](/dashboard)
- [Trend: link saved over time](/insights/new#insight=TRENDS)
- [Trend: link deleted over time (churn signal)](/insights/new#insight=TRENDS)
- [Trend: links searched over time](/insights/new#insight=TRENDS)
- [Trend: link favorited over time](/insights/new#insight=TRENDS)
- [Funnel: link saved → link favorited (engagement funnel)](/insights/new#insight=FUNNELS)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
