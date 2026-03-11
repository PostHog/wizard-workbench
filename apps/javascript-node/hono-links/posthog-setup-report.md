<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. The `posthog-node` SDK (v5.28.1) was installed and configured in `index.js`. A singleton PostHog client is initialized with `enableExceptionAutocapture: true` so unhandled exceptions are automatically captured. Five business-critical events are now tracked across all mutating API routes, with contextual properties on each. A distinct ID is read from the optional `X-POSTHOG-DISTINCT-ID` request header (falling back to `'anonymous'`) so server-side events can be correlated with frontend sessions. Graceful shutdown is wired to `SIGINT`/`SIGTERM` to flush any queued events before the process exits. Credentials are stored in `.env` and never hard-coded.

| Event name | Description | File |
|---|---|---|
| `link saved` | Fired when a user saves a new bookmark/link | `index.js` |
| `link updated` | Fired when a user updates an existing link (URL, title, description, tags, or favorite status) | `index.js` |
| `link deleted` | Fired when a user deletes a link | `index.js` |
| `link favorited` | Fired when a user marks a link as a favorite (only when toggling from false → true) | `index.js` |
| `links searched` | Fired when a user filters the link list by tag, search term, or favorites | `index.js` |

## Next steps

To monitor these events, create an **"Analytics basics"** dashboard in PostHog with the following suggested insights:

1. **Link activity over time** – Trends chart with `link saved`, `link updated`, `link deleted` series to see daily content activity
2. **Save → Update → Delete funnel** – Funnel with steps `link saved` → `link updated` → `link deleted` to understand the link lifecycle
3. **Favorites conversion rate** – Trend of `link favorited` vs `link saved` to see what share of saved links get favorited
4. **Search usage** – Trend of `links searched` broken down by `search`, `tag`, or `favorites_only` property to understand discovery patterns
5. **Link churn** – Trend of `link deleted` events to identify when users remove links

You can build these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
