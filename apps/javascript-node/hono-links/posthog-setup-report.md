<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the hono-links Hono API. The `posthog-node` SDK was installed and initialized in `index.js` using environment variables for the API key and host. A helper function extracts the caller's distinct ID from the `X-PostHog-Distinct-ID` request header (falling back to `X-Forwarded-For` or `"anonymous"`), and session ID from `X-PostHog-Session-ID`, enabling correlation with any frontend PostHog session. Event capture calls were added to all mutating route handlers, a `link_favorited` event fires when a link's `favorite` field transitions from `false` to `true`, and a `links_searched` event fires when a search/filter query is used. Hono's `app.onError()` handler calls `posthog.captureException()` for automatic error tracking. Graceful shutdown on `SIGINT`/`SIGTERM` flushes any remaining queued events before the process exits.

| Event | Description | File |
|---|---|---|
| `link_saved` | Fired when a user saves a new link via POST /api/links | index.js |
| `link_updated` | Fired when a user updates a link's fields via PATCH /api/links/:id | index.js |
| `link_favorited` | Fired when a user marks a link as a favorite (favorite changes to true) via PATCH /api/links/:id | index.js |
| `link_deleted` | Fired when a user deletes a link via DELETE /api/links/:id | index.js |
| `links_searched` | Fired when a user searches or filters links via GET /api/links with a search, tag, or favorites query param | index.js |

## Next steps

To complete the setup, create an **"Analytics basics"** dashboard in your PostHog project and add the following insights:

1. **Links saved over time** — Trend of `link_saved` events, to track growth in user saves
2. **Links deleted vs saved** — Trend comparing `link_saved` and `link_deleted` to understand churn/retention of bookmarks
3. **Top search queries** — Table of `links_searched` events broken down by the `search` property
4. **Favorite rate** — Funnel from `link_saved` → `link_favorited` to measure how often saved links get favorited
5. **Error rate** — Trend of `$exception` events to monitor application stability

Visit your PostHog project to create these insights: https://us.i.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
