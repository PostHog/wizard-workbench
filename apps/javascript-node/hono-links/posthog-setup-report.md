<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the `hono-links` Hono/Node.js bookmark API. The `posthog-node` SDK was installed and initialized in `index.js` using environment variables. A `getDistinctId` helper reads the `X-POSTHOG-DISTINCT-ID` request header so that server-side events can be correlated with a client-side session when one is present; otherwise events fall back to the `anonymous` ID. Six events are captured across the route handlers, exception autocapture is enabled, and the PostHog client flushes cleanly on `SIGINT`/`SIGTERM`.

| Event | Description | File |
|---|---|---|
| `link_saved` | A new bookmark link is successfully created | `index.js` |
| `link_updated` | An existing bookmark link is updated (title, url, description, or tags changed) | `index.js` |
| `link_favorited` | A bookmark link is marked as a favorite | `index.js` |
| `link_deleted` | A bookmark link is deleted | `index.js` |
| `links_searched` | User searches links by keyword | `index.js` |
| `links_filtered_by_tag` | User filters links by a specific tag | `index.js` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights to monitor user behavior:

1. **Links saved over time** — Trend of `link_saved` events to track growth in bookmarks added
2. **Links deleted over time** — Trend of `link_deleted` events to monitor churn/clean-up behavior
3. **Save → Favorite conversion funnel** — Funnel from `link_saved` → `link_favorited` to see how many saved links get favorited
4. **Top search queries** — Table of `links_searched` events broken down by the `query` property
5. **Most used tags** — Table of `links_filtered_by_tag` events broken down by the `tag` property

Create the dashboard and insights in your PostHog project:
- **PostHog project**: https://us.posthog.com/project/2/dashboards
- **New insight**: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
